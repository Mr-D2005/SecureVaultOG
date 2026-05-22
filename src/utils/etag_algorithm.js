// src/utils/etag_algorithm.js
// Frontend wrapper that uses the crypto helper for robust covert tag generation.

import { encodeCovertTag } from "./crypto_helper";

/**
 * Encode a secret payload into a covert ETag using strong encryption and HMAC.
 * Returns an object compatible with the existing fetch logic.
 * @param {string} secret - any UTF-8 string to hide.
 * @returns {{ etagValue: string, timestamp: number }}
 */
export function encodeETag(secret) {
  // The crypto helper returns a string "cipher.hmac"; we embed it directly.
  const etagValue = encodeCovertTag(secret);
  // Timestamp not directly used client‑side but kept for compatibility.
  const timestamp = Date.now();
  return { etagValue, timestamp };
}

/**
 * Decode is handled server‑side; this stub maintains the API contract.
 * @param {string} _etag - ignored on client.
 * @returns {null}
 */
export function decodeETag(_etag) {
  // In the new design the client does not decode; server validates.
  return null;
}
