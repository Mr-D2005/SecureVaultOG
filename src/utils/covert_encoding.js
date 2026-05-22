// src/utils/covert_encoding.js
/**
 * Patent‑ready encoding for covert payloads using ETag header.
 * Steps:
 *   1. Derive a PBKDF2 key from a passphrase + per‑request salt (timestamp).
 *   2. Encrypt payload with AES‑GCM.
 *   3. XOR first 8 bytes of ciphertext with a nonce derived from timestamp.
 *   4. Encode ciphertext + nonce using Base32 and append CRC‑32 checksum.
 *   5. Return a weak‑ETag formatted string.
 */

import crypto from 'crypto'; // Web Crypto API shim for Node/Vite
import base32 from 'base32-encode';
import crc32 from 'crc-32';

const PASS_PHRASE = 'SecureVaultCovertSecret'; // could be moved to env
const PBKDF2_ITER = 12000;
const KEY_LEN = 32; // 256‑bit

/** Generate a per‑request salt from timestamp (ms) */
function saltFromTimestamp(ts) {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(ts));
  return buf;
}

/** Derive key using PBKDF2 */
function deriveKey(timestamp) {
  const salt = saltFromTimestamp(timestamp);
  return crypto.pbkdf2Sync(PASS_PHRASE, salt, PBKDF2_ITER, KEY_LEN, 'sha256');
}

/** Encrypt payload */
function encryptPayload(payload, key, timestamp) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(payload, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  // prepend iv and tag for decryption
  return Buffer.concat([iv, tag, encrypted]);
}

/** Apply nonce blending (XOR first 8 bytes with timestamp‑derived nonce) */
function blendNonce(buf, timestamp) {
  const nonce = Buffer.alloc(8);
  nonce.writeBigUInt64BE(BigInt(timestamp));
  for (let i = 0; i < 8; i++) {
    buf[i] ^= nonce[i];
  }
  return buf;
}

/** Encode to Base32 + CRC32 checksum */
function encodeBase32WithChecksum(buf) {
  const b32 = base32(buf, 'RFC4648', { padding: false });
  const checksum = (crc32.buf(buf) >>> 0).toString(16).padStart(8, '0');
  return `${b32}.${checksum}`;
}

export function encodeCovert(payload) {
  const timestamp = Date.now();
  const key = deriveKey(timestamp);
  const encrypted = encryptPayload(payload, key, timestamp);
  const blended = blendNonce(encrypted, timestamp);
  const encoded = encodeBase32WithChecksum(blended);
  const etag = `W/\"${timestamp.toString(16)}-${encoded}\"`;
  // compute HMAC for server verification (using same passphrase)
  const hmac = crypto.createHmac('sha256', PASS_PHRASE).update(Buffer.concat([blended, Buffer.from(timestamp.toString())])).digest('hex');
  return { etag, hmac, timestamp };
}

/** Helper to decode on client side (if needed) */
export function decodeCovert(etag) {
  const match = etag.match(/^W\\/\"([0-9a-f]+)-([A-Z2-7]+)\.([0-9a-f]{8})\"$/i);
  if (!match) return null;
  const [, tsHex, b32, checksum] = match;
  const timestamp = parseInt(tsHex, 16);
  const buf = Buffer.from(base32.decode(b32, 'RFC4648'));
  // verify checksum
  if ((crc32.buf(buf) >>> 0).toString(16).padStart(8, '0') !== checksum) return null;
  // undo nonce blending
  const unblended = blendNonce(buf, timestamp);
  // key derivation
  const key = deriveKey(timestamp);
  const iv = unblended.slice(0, 12);
  const tag = unblended.slice(12, 28);
  const ciphertext = unblended.slice(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
  return { payload: decrypted, timestamp };
}
