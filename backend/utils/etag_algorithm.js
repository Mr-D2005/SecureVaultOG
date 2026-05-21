/*
  Backend copy of the ETag algorithm used for encoding/decoding covert payloads.
  This file mirrors src/utils/etag_algorithm.js so the middleware can decode the same format.
*/

/** Utility: simple XOR of a string with a numeric key */
function xorString(str, key) {
  const keyByte = key & 0xff; // use lowest byte for simplicity
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    const xored = charCode ^ keyByte;
    result += String.fromCharCode(xored);
  }
  return result;
}

/** Convert a binary string to hex representation */
function toHex(str) {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    const h = str.charCodeAt(i).toString(16).padStart(2, '0');
    hex += h;
  }
  return hex;
}

/** Convert hex back to binary string */
function fromHex(hex) {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    const code = parseInt(hex.substr(i, 2), 16);
    str += String.fromCharCode(code);
  }
  return str;
}

/**
 * Encode a secret payload into an Apache‑style weak ETag.
 * @param {string} secret – any UTF‑8 string to hide.
 * @returns {{ etagValue: string, timestamp: number }}
 */
function encodeETag(secret) {
  const timestamp = Date.now(); // millisecond precision provides polymorphic salt
  const xorEncoded = xorString(secret, timestamp);
  const cipherHex = toHex(xorEncoded);
  const etagValue = `W/"${timestamp.toString(16)}-${cipherHex}"`;
  return { etagValue, timestamp };
}

/**
 * Decode a previously encoded weak ETag back to its secret.
 * @param {string} etag – the full ETag header value (including the leading W/).
 * @returns {{ secret: string, timestamp: number } | null }
 */
function decodeETag(etag) {
  // Expected pattern: W/"<timestampHex>-<cipherHex>"
  const match = etag.match(/^W\/"([0-9a-f]+)-([0-9a-f]+)"$/i);
  if (!match) return null;
  const [, tsHex, cipherHex] = match;
  const timestamp = parseInt(tsHex, 16);
  const xorEncoded = fromHex(cipherHex);
  const secret = xorString(xorEncoded, timestamp);
  return { secret, timestamp };
}

module.exports = { encodeETag, decodeETag };
