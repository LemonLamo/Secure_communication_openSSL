import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box, Stepper, Step, StepLabel, Avatar } from "@mui/material";
import ComputerIcon from '@mui/icons-material/Computer';
import DnsIcon from '@mui/icons-material/Dns';
import LockIcon from '@mui/icons-material/Lock';


function App() {
  const [message, setMessage] = useState("");
  const [sslSteps, setSslSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [showSteps, setShowSteps] = useState(false);

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
      setCurrentStep(-1);
      setShowSteps(false);
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
          <Typography variant="h6" gutterBottom>SSL/TLS Handshake Animation</Typography>
          {/* Improved vertical alignment: each step is a row with three columns */}
          <Box>
            {/* Header row */}
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap={4} mb={2}>
              <Box flex={1} textAlign="left" minWidth={120}>
                <Typography variant="subtitle1" color="primary">Client</Typography>
                <ComputerIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
              </Box>
              <Box flex={0} minWidth={40}></Box>
              <Box flex={1} textAlign="right" minWidth={120}>
                <Typography variant="subtitle1" color="success.main">Server</Typography>
                <DnsIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              </Box>
            </Box>
            {/* Step rows */}
            {sslSteps.slice(0, currentStep + 1).map((step, idx) => {
              // Determine direction: prefer explicit 'direction' property, fallback to step text
              let direction = step.direction;
              if (!direction) {
                if (step.step.toLowerCase().includes('tcp')) direction = 'client-to-server';
                else direction = 'server-to-client';
              }
              const isClient = direction === 'client-to-server';
              const isServer = direction === 'server-to-client';
              return (
                <Box key={idx} display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap={4} mb={2}>
                  {/* Client step */}
                  <Box flex={1} textAlign="left" minWidth={120}>
                    {isClient && (
                      <Box sx={{ background: '#f9f9f9', p: 2, borderRadius: 2, width: '100%', maxWidth: 300 }}>
                        <Typography variant="body2">
                          <b>Time:</b> {step.time} <br />
                          <b>Step:</b> {step.step} <br />
                          {step.protocol && (<><b>Protocol:</b> {step.protocol} <br /></>)}
                          {step.cipher && (<><b>Cipher:</b> {step.cipher.name} <br /></>)}
                          {step.peerCertificate && (<><b>Peer Certificate Subject:</b> {JSON.stringify(step.peerCertificate)} <br /></>)}
                          {step.issuer && (<><b>Issuer:</b> {JSON.stringify(step.issuer)} <br /></>)}
                          {step.valid_from && (<><b>Valid From:</b> {step.valid_from} <br /></>)}
                          {step.valid_to && (<><b>Valid To:</b> {step.valid_to} <br /></>)}
                          {typeof step.authorized !== 'undefined' && (<><b>Authorized:</b> {String(step.authorized)} <br /></>)}
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
                      </Box>
                    )}
                  </Box>
                  {/* Arrow */}
                  <Box flex={0} minWidth={40} display="flex" alignItems="center" justifyContent="center">
                    <Typography variant="h3">
                      {direction === 'client-to-server' ? '\u2192' : '\u2190'}
                    </Typography>
                  </Box>
                  {/* Server step */}
                  <Box flex={1} textAlign="right" minWidth={120}>
                    {isServer && (
                      <Box sx={{ background: '#f9f9f9', p: 2, borderRadius: 2, width: '100%', maxWidth: 300, ml: 'auto' }}>
                        <Typography variant="body2">
                          <b>Time:</b> {step.time} <br />
                          <b>Step:</b> {step.step} <br />
                          {step.protocol && (<><b>Protocol:</b> {step.protocol} <br /></>)}
                          {step.cipher && (<><b>Cipher:</b> {step.cipher.name} <br /></>)}
                          {step.peerCertificate && (<><b>Peer Certificate Subject:</b> {JSON.stringify(step.peerCertificate)} <br /></>)}
                          {step.issuer && (<><b>Issuer:</b> {JSON.stringify(step.issuer)} <br /></>)}
                          {step.valid_from && (<><b>Valid From:</b> {step.valid_from} <br /></>)}
                          {step.valid_to && (<><b>Valid To:</b> {step.valid_to} <br /></>)}
                          {typeof step.authorized !== 'undefined' && (<><b>Authorized:</b> {String(step.authorized)} <br /></>)}
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
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
          {/* Animation Button Centered Below */}
          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            {!showSteps && (
              <Button variant="contained" color="primary" onClick={() => { setShowSteps(true); setCurrentStep(0); }}>
                Start Animation
              </Button>
            )}
            {showSteps && currentStep < sslSteps.length - 1 && (
              <Button variant="contained" color="primary" onClick={() => setCurrentStep(currentStep + 1)}>
                Next Step
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default App;
