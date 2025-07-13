import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";


function App() {
  const [message, setMessage] = useState("");
  const [sslSteps, setSslSteps] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: e.target.name.value,
      card: e.target.card.value,
      cvv: e.target.cvv.value,
      exp: e.target.exp.value,
    };

    try {
      const res = await fetch("https://localhost:4443/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      setMessage(json.message);

      // Fetch SSL/TLS handshake steps after payment
      const stepsRes = await fetch("https://localhost:4443/ssl-steps");
      const stepsJson = await stepsRes.json();
      setSslSteps(stepsJson);
    } catch (err) {
      console.error("Secure payment failed", err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Secure Checkout</Typography>
      <form onSubmit={handleSubmit}>
        <TextField name="name" label="Full Name" fullWidth margin="normal" />
        <TextField name="card" label="Card Number" fullWidth margin="normal" />
        <TextField name="cvv" label="CVV" fullWidth margin="normal" />
        <TextField name="exp" label="Expiry Date (MM/YY)" fullWidth margin="normal" />
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">Pay Securely</Button>
        </Box>
      </form>
      {message && (
        <Box mt={2}>
          <Typography variant="body1">{message}</Typography>
        </Box>
      )}
      {sslSteps.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>SSL/TLS Handshake Steps</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {sslSteps.map((step, idx) => (
              <li key={idx}>
                <Typography variant="body2">
                  <b>Time:</b> {step.time} <br />
                  <b>Step:</b> {step.step} <br />
                  <b>Protocol:</b> {step.protocol} <br />
                  <b>Cipher:</b> {step.cipher && step.cipher.name} <br />
                  <b>Peer Certificate Subject:</b> {step.peerCertificate ? JSON.stringify(step.peerCertificate) : 'N/A'} <br />
                  <b>Issuer:</b> {step.issuer ? JSON.stringify(step.issuer) : 'N/A'} <br />
                  <b>Valid From:</b> {step.valid_from || 'N/A'} <br />
                  <b>Valid To:</b> {step.valid_to || 'N/A'} <br />
                  <b>Authorized:</b> {String(step.authorized)} <br />
                  {step.authorizationError && (<><b>Authorization Error:</b> {step.authorizationError} <br /></>)}
                  {step.serverPublicKey && (
                    <>
                      <b>Server Public Key:</b>
                      <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: '#f5f5f5', p: 1, borderRadius: 1, mt: 1 }}>
                        {step.serverPublicKey}
                      </Box>
                    </>
                  )}
                </Typography>
              </li>
            ))}
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default App;
