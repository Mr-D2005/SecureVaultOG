// backend/utils/crypto_helper.js
// Helper utilities for cryptographic operations on the server (Node.js)
// Mirrors the browser implementation in src/utils/crypto_helper.js

const crypto = require('crypto');

/**
 * Derive a 256‑bit AES‑GCM key from a secret using PBKDF2.
 * Fixed salt for deterministic key (can be changed for higher security).
 * @param {string} secret
 * @returns {Buffer} key
 */
function getAesKey(secret) {
  const salt = Buffer.from([1, 2, 3, 4]);
  return crypto.pbkdf2Sync(secret, salt, 100000, 32, 'sha256'); // 256‑bit key
}

/**
 * Derive an HMAC‑SHA256 key from a secret.
 * @param {string} secret
 * @returns {Buffer} key
 */
function getHmacKey(secret) {
  return Buffer.from(secret, 'utf8');
}

/**
 * Encode a covert tag: encrypt timestamp+nonce and append HMAC.
 * Returns a string "<ctBase64>.<hmacBase64>".
 * @param {string} secret
 * @returns {string}
 */
function encodeCovertTag(secret) {
  const timestamp = Date.now();
  const nonce = crypto.randomBytes(8);
  const buf = Buffer.alloc(16);
  buf.writeBigUInt64BE(BigInt(timestamp), 0);
  nonce.copy(buf, 8);

  const aesKey = getAesKey(secret);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);
  const ciphertext = Buffer.concat([cipher.update(buf), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const combined = Buffer.concat([iv, authTag, ciphertext]); // iv|tag|ct
  const ctB64 = combined.toString('base64');

  const hmacKey = getHmacKey(secret);
  const hmac = crypto.createHmac('sha256', hmacKey).update(ciphertext).digest('base64');

  return `${ctB64}.${hmac}`;
}

/**
 * Decode a covert tag produced by encodeCovertTag.
 * Verifies HMAC and returns { secret, timestamp, nonce }.
 * @param {string} etag
 * @param {string} secret – the shared secret used for key derivation
 * @returns {{secret:string,timestamp:number,nonce:Buffer}|null}
 */
function decodeCovertTag(etag, secret) {
  const parts = etag.split('.');
  if (parts.length !== 2) return null;
  const [ctB64, hmacB64] = parts;
  const combined = Buffer.from(ctB64, 'base64');
  if (combined.length < 12 + 16) return null; // iv+tag+ct minimal
  const iv = combined.slice(0, 12);
  const authTag = combined.slice(12, 28);
  const ciphertext = combined.slice(28);

  const hmacKey = getHmacKey(secret);
  const expectedHmac = crypto.createHmac('sha256', hmacKey).update(ciphertext).digest('base64');
  if (!crypto.timingSafeEqual(Buffer.from(expectedHmac, 'base64'), Buffer.from(hmacB64, 'base64'))) {
    return null;
  }

  const aesKey = getAesKey(secret);
  const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  const timestamp = Number(plaintext.readBigUInt64BE(0));
  const nonce = plaintext.slice(8);
  return { secret, timestamp, nonce };
}

module.exports = { encodeCovertTag, decodeCovertTag };
