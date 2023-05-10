
import express from "express";
import fetch from "node-fetch";
import path from "path";
const __dirname = path.resolve();

const app = express();
const getAccessToken = async () => {
  const clientId = "<test>";
  const appSecret = "<test_secret>";
  const url = "https://api-m.sandbox.paypal.com/v1/oauth2/token";
  const response = await fetch(url, {
    body: "grant_type=client_credentials",
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(clientId + ":" + appSecret).toString("base64"),
    },
  });
  const data = await response.json();
  return data.access_token;
};

const createOrder = async () => {
  const url = "https://api-m.sandbox.paypal.com/v2/checkout/orders";
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "0.02",
        },
      },
    ],
  };
  const headers = {
    Authorization: `Bearer ${await getAccessToken()}`,
    "Content-Type": "application/json",
  };
  const response = await fetch(url, {
    headers,
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (data.error) {
    throw new Error(error);
  }
  return data;
};

const capturePayment = async (orderID) => {
  const url = `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`;
  const headers = {
    Authorization: `Bearer ${await getAccessToken()}`,
    "Content-Type": "application/json",
  };
  const response = await fetch(url, {
    headers,
    method: "POST",
  });
  const data = await response.json();
  if (data.error) {
    throw new Error(error);
  }
  return data;
};

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.post("/orders", async (req, res) => {
  const response = await createOrder();
  res.json(response);
});

app.post("/orders/:orderID/capture", async (req, res) => {
  const response = await capturePayment(req.params.orderID);
  res.json(response);
});

app.listen(9597, () => {
  console.log("listening on http://localhost:9597/");
});