# Secure Communication with OpenSSL, Node.js, and React

## Project Overview
This project demonstrates secure client-server communication using SSL/TLS. It features a Node.js (Express) backend running over HTTPS with OpenSSL-generated certificates, and a React frontend that visualizes the SSL/TLS handshake process step-by-step for educational purposes.

## SSL/TLS Handshake Flow
- **Certificates:**
  - `server.crt`/`server.key`: Used by the Node.js server for HTTPS.
  - `client.crt`/`client.key`: Used for React dev server HTTPS.

- **Backend (Node.js/Express):**
  - Runs over HTTPS using OpenSSL certificates.
  - Logs each step of the SSL/TLS handshake (TCP connection, handshake start, handshake complete, simulated handshake response).
  - Exposes `/ssl-steps` endpoint to provide handshake steps to the frontend.

- **Frontend (React):**
  - Fetches and displays handshake steps as an animated, step-by-step visualization.
  - Uses HTTPS in development by setting `.env` with `SSL_CRT_FILE` and `SSL_KEY_FILE`.

## How the Code Works
### Node.js Server
- Sets up an HTTPS server with Express using `server.crt` and `server.key`.
- Handles CORS for cross-origin requests from the React frontend.
- Logs handshake steps in memory for each new connection:
  - TCP connection established
  - TLS handshake started
  - TLS handshake completed (with protocol, cipher, certificate info, public key)
  - Simulated handshake response (for educational animation)
- Provides `/ssl-steps` endpoint for the frontend to fetch handshake steps.

### React Frontend
- Submits payment data to the backend over HTTPS.
- After payment, fetches handshake steps from `/ssl-steps`.
- Animates each handshake step in a two-column layout (client/server) with directional arrows.
- Uses HTTPS in development by setting `.env`:
  ```
  HTTPS=true
  SSL_CRT_FILE=../certs/client.crt
  SSL_KEY_FILE=../certs/client.key
  ```

## How to Run
1. **Generate SSL Certificates** (if not already present):
   - Use OpenSSL to generate `server.crt`, `server.key`, `client.crt`, `client.key`.
2. **Start the Backend:**
   - Run `node index.js` in the backend directory.
3. **Start the Frontend:**
   - Ensure `.env` is set up in the frontend directory as above.
   - Run `npm start` in the frontend directory.
   - The app will be served over HTTPS.
4. **Test the App:**
   - Open the React app in your browser (accept the self-signed certificate warning if prompted).
   - Submit a payment to see the SSL/TLS handshake animation.

## Educational Value
- **Visualization:** See each step of the SSL/TLS handshake, including TCP connection, handshake start, certificate/public key exchange, and simulated handshake response.
- **Security:** Demonstrates secure communication and the basics of certificate-based authentication.

## Notes
- The React app uses HTTPS in development for demonstration, but browsers do not allow direct use of client certificates via JavaScript.
- The handshake steps are simulated for educational clarity and may not represent every low-level protocol detail.

---

You can convert this Markdown report to PDF using any Markdown editor or online tool.
