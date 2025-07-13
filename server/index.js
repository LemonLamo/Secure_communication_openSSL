const fs = require("fs");
const https = require("https");
const express = require("express");
const path = require("path");

const app = express();

// Add CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

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
