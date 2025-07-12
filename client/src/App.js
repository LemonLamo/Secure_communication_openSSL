import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";

function App() {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: e.target.name.value,
      card: e.target.card.value,
      cvv: e.target.cvv.value,
      exp: e.target.exp.value,
    };

    try {
      const res = await fetch("/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      setMessage(json.message);
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
    </Container>
  );
}

export default App;
