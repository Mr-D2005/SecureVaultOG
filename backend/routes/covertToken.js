// backend/routes/covertToken.js
// Endpoint that returns a one‑time token and a random header name for dynamic hot‑key derivation.
// The token and header name are stored in the in‑memory session store for the short‑lived session.

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { setSession } = require('../utils/session_store');

router.get('/', (req, res) => {
  // Generate a 16‑byte random token (URL‑safe base64).
  const token = crypto.randomBytes(16).toString('base64url');
  // Generate a short random header name, e.g., "x-a9f3c2d1".
  const headerName = 'x-' + [...crypto.randomBytes(4)].map(b => b.toString(16).padStart(2, '0')).join('');
  // Session expires in 5 minutes.
  const expiry = Math.floor(Date.now() / 1000) + 300;
  // Store the mapping.
  setSession(token, headerName, expiry);
  // Return to the client.
  res.json({ token, headerName, expiry });
});

module.exports = router;
