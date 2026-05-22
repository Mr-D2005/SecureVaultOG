// src/utils/crypto_helper.js
// Helper utilities for cryptographic operations in the browser
// Uses Web Crypto API to derive keys, encrypt data, and generate HMACs.

/**
 * Derive a CryptoKey for AES-GCM encryption from a secret string.
 * Simple derivation using SHA-256 hash of the secret.
 * @param {string} secret
 * @returns {Promise<CryptoKey>}
 */
async function getAesKey(secret) {
  const enc = new TextEncoder();
  const secretKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  // Fixed salt for deterministic key (could be random per session for higher security)
  const salt = new Uint8Array([1, 2, 3, 4]);
  const aesKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    secretKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
  return aesKey;
}

/**
 * Derive a CryptoKey for HMAC-SHA256 from a secret string.
 * @param {string} secret
 * @returns {Promise<CryptoKey>}
 */
async function getHmacKey(secret) {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Encode the covert tag: encrypt timestamp+nonce and append HMAC.
 * Returns a string of the form `<ciphertextBase64>.<hmacBase64>`.
 * @param {string} secret
 * @returns {Promise<string>}
 */
export async function encodeCovertTag(secret) {
  const timestamp = Date.now();
  // 8‑byte random nonce
  const nonce = crypto.getRandomValues(new Uint8Array(8));
  // Pack timestamp (8 bytes) + nonce (8 bytes) into an ArrayBuffer
  const buf = new ArrayBuffer(16);
  const view = new DataView(buf);
  view.setFloat64(0, timestamp); // 8‑byte double
  new Uint8Array(buf, 8).set(nonce);
  const plaintext = new Uint8Array(buf);

  const aesKey = await getAesKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96‑bit IV for GCM
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    plaintext
  );
  const ctUint8 = new Uint8Array(ciphertext);
  const combined = new Uint8Array(iv.length + ctUint8.length);
  combined.set(iv, 0);
  combined.set(ctUint8, iv.length);
  const ctB64 = btoa(String.fromCharCode(...combined));

  const hmacKey = await getHmacKey(secret);
  const hmac = await crypto.subtle.sign({ name: "HMAC" }, hmacKey, ctUint8);
  const hmacB64 = btoa(String.fromCharCode(...new Uint8Array(hmac)));

  return `${ctB64}.${hmacB64}`;
}
