const { google } = require("googleapis");
const account = require("./service-account.json");
const updateKey = require("./updateKey.json");
const express = require("express");
const {
  validateReceiptAndroid,
  validateReceiptIos,
  setCodes,
  getCodes,
} = require("./validate.js");

const dateFormat = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};

const app = express();
const JWTClient = new google.auth.JWT(
  account.client_email,
  null,
  account.private_key,
  ["https://www.googleapis.com/auth/androidpublisher"]
);

app.use(express.json());

app.post("/", (req, res) => {
  console.log(
    `[${new Date().toLocaleString("ru", dateFormat)}] New validation. Plat: ${
      req.body.platform
    }, ver:${req.body.ver}, products:${
      req.body.products ? req.body.products.length : "??"
    }`
  );
  if ((platf = req.body.platform)) {
    let version = req.body.ver;
    let action = (data) => {
      res.json(data);
    };
    if (platf == "android") {
      JWTClient.getAccessToken(async (err, accessToken) => {
        if (!err) {
          validateReceiptAndroid(
            accessToken,
            req.body.products,
            version,
            action
          );
        }
      });
    } else if (platf == "ios") {
      val = validateReceiptIos(req.body.receipt, version, action);
    } else {
      res.status(404).send("(；⌣̀_⌣́) да шо тебе надо!");
    }
    return;
  } else {
    return res.status(404).send("(；⌣̀_⌣́)");
  }
});

app.get("/update", (req, res) => {
  if (req.body.psw == updateKey.key) {
    data = getCodes((data) => {
      res.json(data);
    });
    return;
  } else {
    res.status(404).send("(づ◡﹏◡)づ нене");
  }
});

app.post("/update", (req, res) => {
  if (req.body.psw == updateKey.key) {
    setCodes(req.body.data);
    console.log("Добавлены новые коды шифрования:");
    console.log(req.body.data);
    return res.status(200).send("OK");
  } else {
    res.status(404).send("(▽◕ ᴥ ◕▽) xuya чё хочешь!");
  }
});

app.listen(8000);

console.log("server Started");
