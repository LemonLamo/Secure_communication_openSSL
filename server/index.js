const fs = require("fs");
const https = require("https");
const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/build")));

app.post("/checkout", (req, res) => {
  console.log("Secure Payment Received:", req.body);
  res.json({ message: "✅ Payment processed securely!" });
});

const sslOptions = {
  key: fs.readFileSync("../certs/server.key"),
  cert: fs.readFileSync("../certs/server.crt"),
};

https.createServer(sslOptions, app).listen(4443, () => {
  console.log("✅ Secure server running on https://localhost:4443");
});
