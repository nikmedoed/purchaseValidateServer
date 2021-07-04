const productIdRulesSets = require("./key_productIdSets.json");

const checkAllProducts = (product) => {
  
  for (key of Object.keys(productIdRulesSets)){
    if (product.includes(key)){
      return productIdRulesSets[key]
    }
  }  
  return [product]
}
  

const iosKey = require("./key_ios.json");
const sqlite3 = require("sqlite3").verbose();
const fetch = require("node-fetch");


var db = new sqlite3.Database("./server.db3");
db.serialize(function () {
  db.run(
    "CREATE TABLE IF NOT EXISTS Codes (version INTEGER, productId TEXT, key TEXT)"
  )
    .run(
      "CREATE TABLE IF NOT EXISTS AndroidReceipt (productId TEXT, purchaseToken TEXT, purchaseTime NUMERIC, signatureAndroid TEXT)"
    )
    .run(
      "CREATE TABLE IF NOT EXISTS IosReceipt (receipt TEXT, products TEXT, expDate NUMERIC)"
    );
});


function addChacheiOs(receipt, products, expDate) {
  products = typeof products == "object" ? products.join(",") : products;
  db.run(`INSERT into IosReceipt VALUES(?, ?, ?)`, [
    receipt,
    products,
    expDate,
  ]);
}


function addChacheAndroid(item) {
  db.run(
    `INSERT into AndroidReceipt VALUES(?, ?, ?, ?)`,
    ["productId", "purchaseToken", "transactionDate", "signatureAndroid"].map(
      (el) => item[el]
    )
  );
}


const fetchJsonOrThrow = async (url, receiptBody) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(receiptBody),
  });
  if (!response.ok)
    throw Object.assign(new Error(response.statusText), {
      statusCode: response.status,
    });
  return response.json();
};

const requestAgnosticReceiptValidationIos = async (receiptBody) =>
  fetchJsonOrThrow("https://buy.itunes.apple.com/verifyReceipt", receiptBody)
    .catch((err) => {
      console.log(`AppStore verification Error: ${err}`);
    })
    .then((response) => {
      if ((response && response.status === 21007) || !response) {
        return fetchJsonOrThrow(
          "https://sandbox.itunes.apple.com/verifyReceipt",
          receiptBody
        );
      }
      return response;
    })
    .catch((err) => {
      console.log(`AppStore verification SandBox Error: ${err}`);
    });

module.exports.validateReceiptIos = async (receipt, version, action) => {
  const nowMS = Date.now(); //1619200150000
  let products = [];
  let expdate;

  db.get(
    `SELECT products, expDate FROM IosReceipt WHERE receipt=(?)`,
    receipt,
    async (err, row) => {
      err && console.log(`get Base Ios Err: ${err}`);

      if (row) {
        products = row.products.split(",");
        expdate = row.expDate;
      }
      if ((expdate && expdate < nowMS) || products.length == 0) {
        let response = await requestAgnosticReceiptValidationIos({
          "receipt-data": receipt,
          password: iosKey.key,
        });
        if (response) {
          products = [];
          expdate = null;
          for (resp of response.latest_receipt_info) {
            let product = resp.product_id;
            if (resp.expires_date_ms) {
              let redms = parseInt(resp.expires_date_ms);
              if (redms < nowMS) {
                continue;
              }
              expdate = redms < expdate ? expdate : redms;
            }
            products.push(product);
          }
          products = [...new Set(products)];
          db.serialize(function () {
            db.run(`DELETE from IosReceipt WHERE receipt="${receipt}"`);
            addChacheiOs(receipt, products, expdate);
          });
        }
      }
      getKeys(products, version, action);
    }
  );
};

/**
 * Validate receipt for Android. and return codes
 */
module.exports.validateReceiptAndroid = (
  accessToken,
  products,
  version,
  action
) => {
  let sqlproducts = products
    .map(
      (el) =>
        `(${["productId", "purchaseToken"]
          .map((elem) => `${elem}="${el[elem]}"`)
          .join(" AND ")})`
    )
    .join(" OR ");
  db.all(
    `SELECT * FROM AndroidReceipt WHERE ${sqlproducts}`,
    async (err, rows) => {
      if (err) {
        console.log(err);
      }
      keys = [];
      for (const row of products) {
        if (
          rows.find((e) => {
            return e.productId == row.productId;
          })
        ) {
          keys.push(row.productId);
        } else {
          if (await validateReceiptGooglePlay(accessToken, row)) {
            keys.push(row.productId);
          }
        }
      }
      getKeys(keys, version, action);
    }
  );
};

// TODO как-то проверять на отмены товара
// TODO проверка актуальности подписки // TODO проверка продления подписки
// По идее оба пункта проверяются гуглом, и он не выдаст продукты, что истекли
// Но если ломанут, то надо как-то проверять, что покупка не протухла
// Сейчас просто проверяется честность чека
// TODO их и хранить может потребоваться иначе, или вычислять число дней до конца
validateReceiptGooglePlay = async (accessToken, item) => {
  productId = item.productId;
  purchaseToken = item.purchaseToken;
  time = item.purchaseTime;
  packageName = productId.split(".");
  isSub = packageName.pop().includes("subscription");
  packageName = packageName.join(".");
  const type = isSub ? "subscriptions" : "products";
  const url =
    "https://androidpublisher.googleapis.com/androidpublisher/v3/applications" +
    `/${packageName}/purchases/${type}/${productId}` +
    `/tokens/${purchaseToken}?access_token=${accessToken}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    // console.log(await response.json());
    addChacheAndroid(item);
    return true;
  }
  return false;
};


function getKeys(keys, version, clbk) {
  let check = new Set();
  console.log(keys)
  keys.forEach(key => checkAllProducts(key).forEach(e => check.add(`"${e}"`)))
  keys = {};
  let checkFilter =` AND productId IN (${[...check].join(",")})`;
  db.all(
    `SELECT productId, key FROM Codes WHERE ` +
      `version=${version}${checkFilter}`,
    (err, rows) => {
      // console.log(rows);
      err && console.log(err);
      if (rows) {
        rows.forEach((row) => {
          keys[row.productId] = row.key;
        });
      }
      clbk(keys);
    }
  );
}


module.exports.setCodes = (codes) => {
  db.serialize(function () {
    codes.forEach((el) => {
      db.run(
        `DELETE from Codes WHERE Codes.version=${el[0]} AND Codes.productId="${el[1]}"`
      );
      db.run(`INSERT into Codes VALUES(?, ?, ?)`, el);
    });
  });
};

module.exports.getCodes = (clbk) => {
  return db.serialize(() => {
    db.all("SELECT * from Codes", function (err, rows) {
      if (err) {
        console.log(err);
        clbk([]);
      } else {
        clbk(rows);
      }
    });
  });
};
