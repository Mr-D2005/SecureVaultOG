// backend/middleware/covertSync.js
// Updated middleware implementing cryptographic validation, nonce replay protection, and basic rate limiting.

const { decodeCovertTag } = require('../utils/crypto_helper');

// In‑memory stores for nonces and IP request counts
const usedNonces = new Set();
const ipCounters = new Map();
const NONCE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MIN = 30; // per IP

// Helper to clean up old nonces
function scheduleNonceRemoval(nonce) {
  setTimeout(() => usedNonces.delete(nonce.toString('hex')), NONCE_TTL_MS);
}

function rateLimited(ip) {
  const now = Date.now();
  const record = ipCounters.get(ip) || { count: 0, start: now };
  if (now - record.start > RATE_LIMIT_WINDOW_MS) {
    // reset window
    record.count = 1;
    record.start = now;
  } else {
    record.count += 1;
  }
  ipCounters.set(ip, record);
  return record.count > MAX_REQUESTS_PER_MIN;
}

/**
 * Covert Header Sync middleware – validates the custom ETag tag.
 * Expected header: "etag" (or custom via options) containing <cipher>.<hmac>
 */
function covertHeaderSync(options = {}) {
  const headerName = (options.headerName || 'etag').toLowerCase();
  // Shared secret for key derivation – can be set via env, fallback to a static value.
  const sharedSecret = process.env.COAGENT_SECRET || 'DEFAULT_STATIC_COAGENT_SECRET_2026';
  return (req, res, next) => {
    const ip = req.ip || req.connection?.remoteAddress || '';
    if (rateLimited(ip)) {
      res.status(429).json({ success: false, message: 'Rate limit exceeded' });
      return;
    }
    const rawHeader = req.headers[headerName] || req.headers[headerName.startsWith('x-') ? headerName : `x-${headerName}`];
    
    // Check for custom dynamic header if default not found
    let dynamicHeaderName = headerName;
    if (!rawHeader) {
      const headerCandidates = Object.keys(req.headers).filter(name => /^x-[0-9a-f]{8}$/.test(name));
      if (headerCandidates.length > 0) {
        dynamicHeaderName = headerCandidates[0];
      }
    }
    
    const finalRawHeader = rawHeader || req.headers[dynamicHeaderName];
    if (!finalRawHeader) return next();

    // Look up dynamic token based on the header name we received
    const { getTokenByHeaderName } = require('../utils/session_store');
    const dynamicSecret = getTokenByHeaderName(dynamicHeaderName);
    const activeSecret = dynamicSecret || sharedSecret;

    const result = decodeCovertTag(finalRawHeader, activeSecret);
    if (!result) {
      // Invalid tag – continue without attaching secret.
      return next();
    }
    const nonceHex = result.nonce.toString('hex');
    if (usedNonces.has(nonceHex)) {
      // Replay detected – reject silently.
      return next();
    }
    usedNonces.add(nonceHex);
    scheduleNonceRemoval(result.nonce);
    req.covertSecret = result.secret;
    req.covertTimestamp = result.timestamp;
    req.covertNonce = nonceHex;
    next();
  };
}

module.exports = covertHeaderSync;
