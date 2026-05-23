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
 * Decode a covert tag produced by the browser's encodeCovertTag (WebCrypto).
 * 
 * WebCrypto AES-GCM format: combined = iv(12) | ciphertext | authTag(16)
 * (auth tag is APPENDED at the end by WebCrypto, not in the middle)
 * 
 * HMAC is computed over the full ciphertext-with-authtag blob (matching frontend).
 * 
 * @param {string} etag  - "<ctBase64>.<hmacBase64>"
 * @param {string} secret - shared secret for key derivation
 * @returns {{secret:string, timestamp:number, nonce:Buffer}|null}
 */
function decodeCovertTag(etag, secret) {
  try {
    const parts = etag.split('.');
    if (parts.length !== 2) return null;
    const [ctB64, hmacB64] = parts;

    // combined = iv(12) | ciphertext_with_authtag_appended
    const combined = Buffer.from(ctB64, 'base64');
    if (combined.length < 12 + 16 + 1) return null; // need at least iv + authtag + 1 byte

    const iv = combined.slice(0, 12);
    // WebCrypto bundles authTag at the END of ciphertext output
    const ciphertextWithTag = combined.slice(12); // everything after iv
    const authTag = ciphertextWithTag.slice(-16); // last 16 bytes = auth tag
    const ciphertext = ciphertextWithTag.slice(0, -16); // everything before auth tag

    // HMAC was computed on the frontend over ctUint8 = full ciphertextWithTag
    const hmacKey = getHmacKey(secret);
    const expectedHmac = crypto.createHmac('sha256', hmacKey).update(ciphertextWithTag).digest('base64');

    let hmacValid = false;
    try {
      hmacValid = crypto.timingSafeEqual(
        Buffer.from(expectedHmac, 'base64'),
        Buffer.from(hmacB64, 'base64')
      );
    } catch (_) { return null; }

    if (!hmacValid) return null;

    const aesKey = getAesKey(secret);
    const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, iv);
    decipher.setAuthTag(authTag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

    // plaintext = timestamp(8 float64) | nonce(8) | optional payload
    const view = new DataView(plaintext.buffer, plaintext.byteOffset, plaintext.byteLength);
    const timestamp = view.getFloat64(0); // match frontend setFloat64
    const nonce = plaintext.slice(8, 16);

    let returnedSecret = secret;
    if (plaintext.length > 16) {
      returnedSecret = plaintext.slice(16).toString('utf8');
    }

    return { secret: returnedSecret, timestamp, nonce };
  } catch (err) {
    console.error('[CryptoHelper] decodeCovertTag error:', err.message);
    return null;
  }
}

module.exports = { encodeCovertTag, decodeCovertTag };
