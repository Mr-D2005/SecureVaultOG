// backend/routes/covertToken.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { setSession } = require('../utils/session_store');
const { TreeParityMachine, decodeOutputs, encodeOutputs } = require('../utils/tpm_crypto');
const { PROFILES } = require('../utils/env_morpher');

// In-memory store for derived keys (in a real app, use Redis)
global.tpmKeys = global.tpmKeys || {};

router.get('/', async (req, res) => {
  const token = crypto.randomBytes(16).toString('base64url');
  
  // Choose a random environment profile
  const profileKeys = Object.keys(PROFILES);
  const selectedProfile = PROFILES[profileKeys[Math.floor(Math.random() * profileKeys.length)]];
  
  const expiry = Math.floor(Date.now() / 1000) + 300;
  
  // TPM Sync (if client sent their output matrix)
  // Client sends 500 bits (125 hex chars) as X-Telemetry-Matrix
  const clientMatrixHex = req.headers['x-telemetry-matrix'];
  let serverMatrixHex = '';
  
  if (clientMatrixHex) {
      // Use a fixed seed for PRNG for the session (we can derive from token, but hardcoded 12345 for demo)
      const tpm = new TreeParityMachine(3, 50, 4, 12345);
      const clientOutputs = decodeOutputs(clientMatrixHex, 500);
      const serverOutputs = tpm.syncBatch(clientOutputs);
      serverMatrixHex = encodeOutputs(serverOutputs);
      
      // Save the derived key for this token
      global.tpmKeys[token] = tpm.getDerivedKey();
  }

  // Store the mapping
  setSession(token, selectedProfile, expiry);
  
  res.json({ 
      token, 
      profile: selectedProfile, 
      expiry,
      tpmMatrix: serverMatrixHex 
  });
});

module.exports = router;
