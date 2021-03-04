var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./server.db3");
db.serialize(function () {
  db.run(
    "CREATE TABLE IF NOT EXISTS Codes (version INTEGER, productId TEXT, key TEXT)"
  ).run(
    "CREATE TABLE IF NOT EXISTS AndroidReceipt (productId TEXT, purchaseToken TEXT, purchaseTime NUMERIC)"
  );
  // .run("CREATE TABLE IF NOT EXISTS IosReceipt (productId TEXT, purchaseToken TEXT, purchaseTime NUMERIC)");
});

const fetch = require("node-fetch");

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

module.exports.requestAgnosticReceiptValidationIos = async (receiptBody) => {
  const response = await fetchJsonOrThrow(
    "https://buy.itunes.apple.com/verifyReceipt",
    receiptBody
  );

  // Best practice is to check for test receipt and check sandbox instead
  // https://developer.apple.com/documentation/appstorereceipts/verifyreceipt
  if (
    response &&
    response.status === Apple.ReceiptValidationStatus.TEST_RECEIPT
  ) {
    const testResponse = await fetchJsonOrThrow(
      "https://sandbox.itunes.apple.com/verifyReceipt",
      receiptBody
    );
    return testResponse;
  }
  return response;
};

/**
 * Validate receipt for iOS.
 * @param {object} receiptBody the receipt body to send to apple server.
 * @param {boolean} isTest whether this is in test environment which is sandbox.
 * @returns {Promise<Apple.ReceiptValidationResponse | false>}
 */
const validateReceiptIos = async (receiptBody, isTest, version) => {
  if (isTest == null)
    return await requestAgnosticReceiptValidationIos(receiptBody);

  const url = isTest
    ? "https://sandbox.itunes.apple.com/verifyReceipt"
    : "https://buy.itunes.apple.com/verifyReceipt";
  const response = await fetchJsonOrThrow(url, receiptBody);

  return response;
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
      keys = {};
      for (const row of products) {
        if (
          rows.find((e) => {
            return e.productId == row.productId;
          })
        ) {
          keys[row.productId] = { status: true };
        } else {
          keys[row.productId] = {
            status: await validateReceiptGooglePlay(accessToken, row),
          };
        }
      }
      getKeys(keys, version, action);
    }
  );
};

// TODO как-то проверять на отмены товара
// TODO проверка актуальности подписки
// TODO проверка продления подписки
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
    addChache(item);
    return true;
  }
  return false;
};

function addChache(item) {
  db.run(
    `INSERT into AndroidReceipt VALUES(?, ?, ?)`,
    ["productId", "purchaseToken", "purchaseTime"].map((el) => item[el])
  );
}

function getKeys(keys, version, clbk) {
  let check = [];
  for (key in keys) {
    if (keys[key].status) {
      check.push(`productId="${key}"`);
    }
  }
  db.all(
    `SELECT productId, key FROM Codes WHERE ` +
      `version=${version} AND (${check.join(" OR ")})`,
    (err, rows) => {
      err && console.log(err);
      if (rows) {
        rows.forEach((row) => {
          keys[row.productId].key = row.key;
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
