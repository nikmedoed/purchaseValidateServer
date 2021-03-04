var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./server.db3");
// const {
//     validateReceiptAndroid,
//   } = require("./validate.js");
const { google } = require("googleapis");
const account = require("./service-account.json");
const JWTClient = new google.auth.JWT(
  account.client_email,
  null,
  account.private_key,
  ["https://www.googleapis.com/auth/androidpublisher"]
);

const fetch = require("node-fetch");

// ------------------------------  init   --------------------------------------------

db.serialize(function () {
  db.run(
    "CREATE TABLE IF NOT EXISTS AndroidReceipt (productId TEXT, purchaseToken TEXT, purchaseTime NUMERIC)"
  );
  // .run("CREATE TABLE IF NOT EXISTS IosReceipt (productId TEXT, purchaseToken TEXT, purchaseTime NUMERIC)");
});

products = [
  {
    productId: "com.greydigger.ussrcoins.putin",
    purchaseToken:
      "bgfpbnamkbgoepljpjampaic.AO-J1OxDqo-rtiA3rYczgWOFZotUG4uce-FsZNSZ1KEbHHTGNjZAqyIJXVmwvJl7PPSVkdV8iMloJn6mocLHjxpooZu81R1l5WQaTR6cwn3Jh7DJz7TfvzI",
    purchaseTime: 1611485592143,
  },
  {
    productId: "test.test.test.test",
    purchaseToken: "testtts1",
    purchaseTime: 1611485592143,
  },
];

JWTClient.getAccessToken(async (err, accessToken) => {
  validateReceiptAndroid(accessToken, products, 28, (keys) =>
    console.log(keys)
  );
});

// -------------------------code--------------------------------------------------

validateReceiptAndroid = (accessToken, products, version, action) => {
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
      err & console.log(err);
      if (rows) {
        rows.forEach((row) => {
          keys[row.productId].key = row.key;
        });
      }
      clbk(keys);
    }
  );
}
