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


// Store handshake steps in memory (for demo; in production, use a better store)
let handshakeSteps = [];

const sslOptions = {
  key: fs.readFileSync("../certs/server.key"),
  cert: fs.readFileSync("../certs/server.crt"),
};

const server = https.createServer(sslOptions, app);

// Listen for more detailed TLS handshake steps
server.on('connection', (socket) => {
  handshakeSteps.push({
    time: new Date().toISOString(),
    step: `TCP connection established with: ${socket.remoteAddress}`
  });
});

server.on('secureConnection', (tlsSocket) => {
  handshakeSteps.push({
    time: new Date().toISOString(),
    step: `TLS handshake started with: ${tlsSocket.remoteAddress}`
  });

  // Wait for handshake to finish (immediately after event)
  setImmediate(() => {
    const protocol = tlsSocket.getProtocol();
    const cipher = tlsSocket.getCipher();
    let peerCert;
    try {
      peerCert = tlsSocket.getPeerCertificate();
    } catch (e) {
      peerCert = null;
    }
    // Read server public key from certificate
    let serverPublicKey = null;
    try {
      const serverCertPem = fs.readFileSync("../certs/server.crt", "utf8");
      const match = serverCertPem.match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/);
      if (match) {
        const x509 = require('crypto').X509Certificate ? new (require('crypto').X509Certificate)(serverCertPem) : null;
        if (x509 && x509.publicKey) {
          serverPublicKey = x509.publicKey.export({ type: 'spki', format: 'pem' });
        } else {
          // fallback: just show the PEM
          serverPublicKey = serverCertPem;
        }
      }
    } catch (e) {
      serverPublicKey = null;
    }
    handshakeSteps.push({
      time: new Date().toISOString(),
      step: `TLS handshake completed with: ${tlsSocket.remoteAddress}`,
      protocol,
      cipher,
      peerCertificate: peerCert && peerCert.subject ? peerCert.subject : null,
      peerCertificatePem: peerCert && peerCert.raw ? peerCert.raw.toString('base64') : null,
      issuer: peerCert && peerCert.issuer ? peerCert.issuer : null,
      valid_from: peerCert && peerCert.valid_from ? peerCert.valid_from : null,
      valid_to: peerCert && peerCert.valid_to ? peerCert.valid_to : null,
      authorized: tlsSocket.authorized,
      authorizationError: tlsSocket.authorizationError || null,
      serverPublicKey: serverPublicKey
    });

    // Simulate handshake response (server to client)
    handshakeSteps.push({
      time: new Date().toISOString(),
      step: `TLS handshake response sent to: ${tlsSocket.remoteAddress}`,
      direction: 'server-to-client'
    });
  });
});

// Endpoint to get handshake steps
app.get('/ssl-steps', (req, res) => {
  res.json(handshakeSteps);
});

server.listen(4443, () => {
  console.log("✅ Secure server running on https://localhost:4443");
});
