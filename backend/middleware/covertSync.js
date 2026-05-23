// backend/middleware/covertSync.js
const { decodeCovertTag } = require('../utils/crypto_helper');
const nonceFilter = require('../utils/bloomfilter');
const { unmorphPayload, extractToken, PROFILES } = require('../utils/env_morpher');
const { getSession } = require('../utils/session_store');
const { recordArrival } = require('./temporal_tracker');

const ipCounters = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_MIN = 30;

function rateLimited(ip) {
  const now = Date.now();
  const record = ipCounters.get(ip) || { count: 0, start: now };
  if (now - record.start > RATE_LIMIT_WINDOW_MS) {
    record.count = 1;
    record.start = now;
  } else {
    record.count += 1;
  }
  ipCounters.set(ip, record);
  return record.count > MAX_REQUESTS_PER_MIN;
}

function covertHeaderSync(options = {}) {
  const fallbackSecret = process.env.COAGENT_SECRET || 'DEFAULT_STATIC_COAGENT_SECRET_2026';
  
  return (req, res, next) => {
    const ip = req.ip || req.connection?.remoteAddress || '';
    if (rateLimited(ip)) {
      res.status(429).json({ success: false, message: 'Rate limit exceeded' });
      return;
    }
    
    // TEMPORAL STEGANOGRAPHY TRACKER
    const temporalBits = recordArrival(ip);
    
    // Find the token from any of the profiles
    let token = extractToken(PROFILES.STANDARD_APACHE, req.headers) || 
                extractToken(PROFILES.YOUTUBE_TELEMETRY, req.headers) ||
                extractToken(PROFILES.MS_TEAMS_SYNC, req.headers);
                
    if (!token) return next();
    
    const session = getSession(token);
    if (!session) return next();
    
    const profile = session.headerName; // In our covertToken route, we store profile here
    const payloadHex = unmorphPayload(profile, req.headers);
    if (!payloadHex) return next();
    
    // Convert hex payload back to original etag string "<ctB64>.<hmacB64>"
    const etagStr = Buffer.from(payloadHex, 'hex').toString('utf8');
    
    // Use TPM AES key if available
    const tpmKeyBuf = global.tpmKeys && global.tpmKeys[token];
    const secretToUse = tpmKeyBuf ? tpmKeyBuf.toString('base64') : fallbackSecret;
    
    const result = decodeCovertTag(etagStr, secretToUse);
    if (!result) return next(); // HMAC or Decryption failed
    
    // Check Temporal Checksum if spatial payload matched
    if (temporalBits) {
        req.covertTemporalBits = temporalBits;
        // In a strict implementation, we would compare temporalBits against HMAC bits here.
        // For demonstration, we simply record it.
    }
    
    const nonceHex = result.nonce.toString('hex');
    if (nonceFilter.has(nonceHex)) return next(); // Replay Attack
    nonceFilter.add(nonceHex);
    
    req.covertSecret = result.secret;
    req.covertTimestamp = result.timestamp;
    req.covertNonce = nonceHex;

    // Save to CovertDrop table if it looks like an S3 URL
    if (req.covertSecret.includes('s3.amazonaws.com') || req.covertSecret.includes('https://')) {
      const { CovertDrop } = require('../models/index');
      CovertDrop.create({
        s3_url: req.covertSecret,
        temporal_bits: temporalBits || null,
        status: 'INTERCEPTED'
      }).catch(err => console.error('[PEC] Failed to save drop:', err.message));
    }

    next();
  };
}

module.exports = covertHeaderSync;
