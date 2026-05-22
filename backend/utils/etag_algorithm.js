// backend/utils/etag_algorithm.js
// Backend wrapper that uses the crypto helper for robust covert tag generation and verification.

const { encodeCovertTag, decodeCovertTag } = require('./crypto_helper');

/**
 * Encode a secret payload into a covert ETag using strong encryption and HMAC.
 * Returns an object compatible with the existing fetch logic.
 * @param {string} secret - any UTF-8 string to hide.
 * @returns {{ etagValue: string, timestamp: number }}
 */
function encodeETag(secret) {
  const etagValue = encodeCovertTag(secret);
  const timestamp = Date.now();
  return { etagValue, timestamp };
}

/**
 * Decode a covert tag using the shared secret (same as used for encoding).
 * Returns { secret, timestamp, nonce } or null if verification fails.
 * @param {string} etag - the header value.
 * @param {string} secret - shared secret for key derivation (must match encode side).
 * @returns {{ secret: string, timestamp: number, nonce: Buffer } | null }
 */
function decodeETag(etag, secret) {
  return decodeCovertTag(etag, secret);
}

module.exports = { encodeETag, decodeETag };
