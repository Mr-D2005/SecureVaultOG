// src/utils/crypto.js
/**
 * Simple AES‑GCM encryption utilities for the covert channel.
 * The same key derivation (SHA‑256 of the timestamp) is used on both client
 * and server so the payload can be encrypted/decrypted without a pre‑shared
 * secret.
 */

/** Derive a CryptoKey from a numeric timestamp (ms) */
export async function deriveKey(timestamp) {
  // Convert timestamp to UTF‑8 bytes
  const encoder = new TextEncoder();
  const data = encoder.encode(timestamp.toString());
  // SHA‑256 hash -> 32‑byte digest
  const hash = await crypto.subtle.digest('SHA-256', data);
  // Import as an AES‑GCM key (raw format)
  return await crypto.subtle.importKey(
    'raw',
    hash,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

/** Encrypt a string with a key derived from the timestamp. */
export async function encryptPayload(secret, timestamp) {
  const key = await deriveKey(timestamp);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96‑bit IV
  const encoder = new TextEncoder();
  const plaintext = encoder.encode(secret);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    plaintext
  );
  // Concatenate iv + ciphertext and encode as base64 for header transport
  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.byteLength);
  return btoa(String.fromCharCode(...combined));
}

/** Decrypt a base64‑encoded payload using the timestamp‑derived key. */
export async function decryptPayload(b64Payload, timestamp) {
  const key = await deriveKey(timestamp);
  const binary = atob(b64Payload);
  const combined = Uint8Array.from(binary, c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );
  const decoder = new TextDecoder();
  return decoder.decode(plaintext);
}
