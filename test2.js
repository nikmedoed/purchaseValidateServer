// let purchases = [
//   {
//     developerPayloadAndroid: "",
//     orderId: "",
//     productId: "com.greydigger.ussrcoins.putin",
//     purchaseStateAndroid: 1,
//     purchaseToken:
//       "immaeehiehmfplobeinmnenl.AO-J1OxCr-pFkzPWy-wX7iJ1KuZU5ifl8h1b0877NyVv1r0u07CsKTidT6Y8aoJbVM62Iy6NWb-i16Tc69Ng-o-P9WUuF6ziWTr-lfjs_Bdni7HWIJAA3do",
//     signatureAndroid:
//       "GOzEDNv99WHKcTSwHehUfaA3cBVd61TknMy+sCmWVLTKgr4/ZnvmnXTJpiNBO42yjF56HwH+wVTp/fmsOes0m7+ilQ4dRVfGlLHwOtQWsHyhnCxm1g41/3g+JA9QNTZ16PoldVJfFG0YzhOufAZseAs2cteCAlN/RcW9P94RUHOpEGo8ZhDWowcWU36v5SoPkvPr4PZrTEGUkniLWav5WkPJcnuUH+5yioewRY23X1gIZFQvxzEu42csabdwnfHRQC7HzLzxGUH6iYMsaCl/e41Aq0H1YbcYh5vwTrowg9OF3ZCqgcNIrVgFsUxDgaOOIHfBvvj7pwD96pyEbwUXEg==",
//     transactionDate: "1615558312533",
//     transactionId: "",
//   },
//   {
//     developerPayloadAndroid: "",
//     orderId: "GPA.3348-4458-7723-40099",
//     productId: "com.greydigger.ussrcoins.subscription_06_months",
//     purchaseStateAndroid: 1,
//     purchaseToken:
//       "eiajofgnfolhfokbfiomcpfn.AO-J1OxAGD6dKTZfPL37vAosDv5YwCK2AByEuVFU4mA5Ygi2OltjdVLn6rDyPt7mHTq8n-azRQLd5A1lHftdy_Y5SLw8SaNxUYX1NuOhlvFUB-56Teqs86M",
//     signatureAndroid:
//       "noOCUucAEPHm/4FbLxXx89wHLJpaF/BmCe+BDa9/qJNwfxTS5ZpfT9IY4wBSEW/XLMltoBD/KombaAOUJqap7hHsT1HoLyceA/fVrBUB3CjfBlcIXvw4gmqSJ0bclgrQIjtqaqew2t8KeJM6x1kretYQVua9gr3TUcAMcAN1ZtbVV/lYFyfZ4FWmmO6Wi3cgJomU4RXtNAvd6OyliKlXJ4p+1Z+WO8LGIgitXGHtdPA1T9Xcj7QqQmbhd1gTIorWRNSYu/IEIdhbRhsSRcy4GyOZXPUMmXcw1k3i7iCvvIX/HLtL2olgcE9abHJOtrh+Nc+E5jFmDjPqHuYaHU7R+A==",
//     transactionDate: "1615920193828",
//     transactionId: "GPA.3348-4458-7723-40099",
//   },
//   {
//     developerPayloadAndroid: "",
//     orderId: "GPA.3343-4160-5056-28823",
//     productId: "com.greydigger.ussrcoins.subscription_3_months",
//     purchaseStateAndroid: 1,
//     purchaseToken:
//       "aaaimippboolhhlomjimmjhd.AO-J1OwGbY6wpLzwP53JcvjqGuBbRaYyuVAEuXCCQvTp2gZd_V6VLdGpJKEEp28XkQ6b_Ib29S69_BmfvUxNw6BvW6-VEqmN5PGaqx0yabgCqkPfCYCroxY",
//     signatureAndroid:
//       "dIoctN55oZUpqk2b0A1M7zoca0fse7yFxucot8iXrrxjmFFjGTt+p7Z2o05E7puMatcR1Z46U4Y7DseAsKlZnHVk+aqyJsLVvN0lzeMK1O2A9wkN+B0AO/ZwBWYjqvy86GRnNd7kj2VsGOxRkr8KLUMmm1jT+BgxOq0NloV+GCHT00LCvENiDGfdSRD1AjmG12hlqf1XlPmY0RJMkArfhvGewhFuVqi/G7L89CFgykk7NN70dH92vQV49T0Uo8e6UqBeN/Kw6bxVWqhPsk5IY1vg7wVQwEKWb5O7TRS1sh+/YUu7g1Zk4YovFXpDaBH2pbr8h3vGQKG9sYnEth1xsw==",
//     transactionDate: "1615920201535",
//     transactionId: "GPA.3343-4160-5056-28823",
//   },
// ];

// const fetch = require("node-fetch");
// const verificationServerURl = "http://localhost:8000/"; //`${Globals.BASE_URL}:8000`

// var raw = JSON.stringify({
//   platform: "android",
//   ver: 29,
//   products: JSON.stringify(purchases),
// });

// var requestOptions = {
//   method: "POST",
//   body: raw,
// };

// fetch(verificationServerURl, requestOptions)
//   .then((response) => response.json())
//   .then((result) => {
//     log.debug(result);
//     UserData.setPurchasedProducts(Object.keys(result));
//   });
// //   .catch((error) => console.error("Receipt Verification Fetch Error\n", error));

// console.log(
//   `${new Date().toLocaleString("ru", form)} New validation. Plat: ${
//     req.body.platform
//   }, ver:${req.body.ver}, size:${
//     req.body.products ? req.body.products.length : 0
//   }`
// );

const fetch = require("node-fetch");

purchases = [
  {
    developerPayloadAndroid: "",
    orderId: "",
    productId: "com.greydigger.ussrcoins.putin",
    purchaseStateAndroid: 1,
    purchaseToken:
      "immaeehiehmfplobeinmnenl.AO-J1OxCr-pFkzPWy-wX7iJ1KuZU5ifl8h1b0877NyVv1r0u07CsKTidT6Y8aoJbVM62Iy6NWb-i16Tc69Ng-o-P9WUuF6ziWTr-lfjs_Bdni7HWIJAA3do",
    signatureAndroid:
      "GOzEDNv99WHKcTSwHehUfaA3cBVd61TknMy+sCmWVLTKgr4/ZnvmnXTJpiNBO42yjF56HwH+wVTp/fmsOes0m7+ilQ4dRVfGlLHwOtQWsHyhnCxm1g41/3g+JA9QNTZ16PoldVJfFG0YzhOufAZseAs2cteCAlN/RcW9P94RUHOpEGo8ZhDWowcWU36v5SoPkvPr4PZrTEGUkniLWav5WkPJcnuUH+5yioewRY23X1gIZFQvxzEu42csabdwnfHRQC7HzLzxGUH6iYMsaCl/e41Aq0H1YbcYh5vwTrowg9OF3ZCqgcNIrVgFsUxDgaOOIHfBvvj7pwD96pyEbwUXEg==",
    transactionDate: "1615558312533",
    transactionId: "",
  },
  {
    developerPayloadAndroid: "",
    orderId: "GPA.3348-4458-7723-40099",
    productId: "com.greydigger.ussrcoins.subscription_06_months",
    purchaseStateAndroid: 1,
    purchaseToken:
      "eiajofgnfolhfokbfiomcpfn.AO-J1OxAGD6dKTZfPL37vAosDv5YwCK2AByEuVFU4mA5Ygi2OltjdVLn6rDyPt7mHTq8n-azRQLd5A1lHftdy_Y5SLw8SaNxUYX1NuOhlvFUB-56Teqs86M",
    signatureAndroid:
      "noOCUucAEPHm/4FbLxXx89wHLJpaF/BmCe+BDa9/qJNwfxTS5ZpfT9IY4wBSEW/XLMltoBD/KombaAOUJqap7hHsT1HoLyceA/fVrBUB3CjfBlcIXvw4gmqSJ0bclgrQIjtqaqew2t8KeJM6x1kretYQVua9gr3TUcAMcAN1ZtbVV/lYFyfZ4FWmmO6Wi3cgJomU4RXtNAvd6OyliKlXJ4p+1Z+WO8LGIgitXGHtdPA1T9Xcj7QqQmbhd1gTIorWRNSYu/IEIdhbRhsSRcy4GyOZXPUMmXcw1k3i7iCvvIX/HLtL2olgcE9abHJOtrh+Nc+E5jFmDjPqHuYaHU7R+A==",
    transactionDate: "1615920193828",
    transactionId: "GPA.3348-4458-7723-40099",
  },
  {
    developerPayloadAndroid: "",
    orderId: "GPA.3343-4160-5056-28823",
    productId: "com.greydigger.ussrcoins.subscription_3_months",
    purchaseStateAndroid: 1,
    purchaseToken:
      "aaaimippboolhhlomjimmjhd.AO-J1OwGbY6wpLzwP53JcvjqGuBbRaYyuVAEuXCCQvTp2gZd_V6VLdGpJKEEp28XkQ6b_Ib29S69_BmfvUxNw6BvW6-VEqmN5PGaqx0yabgCqkPfCYCroxY",
    signatureAndroid:
      "dIoctN55oZUpqk2b0A1M7zoca0fse7yFxucot8iXrrxjmFFjGTt+p7Z2o05E7puMatcR1Z46U4Y7DseAsKlZnHVk+aqyJsLVvN0lzeMK1O2A9wkN+B0AO/ZwBWYjqvy86GRnNd7kj2VsGOxRkr8KLUMmm1jT+BgxOq0NloV+GCHT00LCvENiDGfdSRD1AjmG12hlqf1XlPmY0RJMkArfhvGewhFuVqi/G7L89CFgykk7NN70dH92vQV49T0Uo8e6UqBeN/Kw6bxVWqhPsk5IY1vg7wVQwEKWb5O7TRS1sh+/YUu7g1Zk4YovFXpDaBH2pbr8h3vGQKG9sYnEth1xsw==",
    transactionDate: "1615920201535",
    transactionId: "GPA.3343-4160-5056-28823",
  },
];

var raw = JSON.stringify({
  platform: "android",
  ver: 29,
  products: purchases,
});

var requestOptions = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: raw,
};

const verificationServerURl = `http://77.222.55.48:8000`; // 'http://192.168.1.67:8000'

fetch(verificationServerURl, requestOptions)
  .then((response) => response.json())
  .then((result) => {
    console.log("Verified products-&-keys pairs", result);
  });
