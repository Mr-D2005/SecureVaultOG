/**
 * ============================================================
 *  PEC DECODER — Backend (Node.js/Express)
 *  Polymorphic ETag Cloaking Algorithm — Decode Module
 *  NetraVaultOG | Application-Layer Steganography Engine
 * ============================================================
 *
 *  This module is the server-side mirror of pec_algorithm.js.
 *  It receives an Apache-format ETag string and the biometric
 *  key (X-Cache-Seed header), reverses the encoding pipeline,
 *  and extracts the original plaintext secret.
 *
 *  DECODING PIPELINE (Reverse of Encoding):
 *    Apache ETag string
 *      → Strip W/"..." wrapper
 *      → Reassemble 3-part hex
 *      → Hex → bytes
 *      → XOR decipher (using X-Cache-Seed key)
 *      → UTF-8 decode
 *      → Strip time-drift salt (|PEC:<timestamp>)
 *      → Original plaintext secret ✓
 * ============================================================
 */

/**
 * Applies a repeating XOR cipher to a byte array.
 * XOR is its own inverse: decode = encode.
 *
 * @param {Buffer} bytes     - Ciphered input bytes
 * @param {number[]} key     - 4-byte key array
 * @returns {Buffer}         - Deciphered bytes
 */
function xorDecipher(bytes, key) {
  return Buffer.from(bytes.map((b, i) => b ^ key[i % key.length]));
}

/**
 * Parses the hex key string from the X-Cache-Seed header.
 * Converts an 8-character hex string back to a 4-byte array.
 *
 * @param {string} keyHex - e.g., "1a2b3c4d"
 * @returns {number[]}    - e.g., [0x1a, 0x2b, 0x3c, 0x4d]
 */
function parseKeyFromHex(keyHex) {
  const key = [];
  for (let i = 0; i < keyHex.length; i += 2) {
    key.push(parseInt(keyHex.substring(i, i + 2), 16));
  }
  return key;
}

/**
 * Strips the time-drift salt injected during encoding.
 * Salt format: "<secret>|PEC:<timestamp_ms>"
 * Returns only the original secret before the "|PEC:" separator.
 *
 * @param {string} saltedText - The decoded string with timestamp salt
 * @returns {string}          - The original plaintext secret
 */
function stripTimeDriftSalt(saltedText) {
  const separator = '|PEC:';
  const idx = saltedText.lastIndexOf(separator);
  if (idx === -1) {
    // No salt found — either corrupted or non-PEC traffic
    return saltedText;
  }
  return saltedText.substring(0, idx);
}

/**
 * PEC DECODE — The full decoding pipeline.
 *
 * @param {string} etagHeader    - The raw ETag header value, e.g. W/"1a2b-3c4d-5e6f"
 * @param {string} cacheSeedHex  - The raw X-Cache-Seed header value, e.g. "1a2b3c4d"
 * @returns {{ success: boolean, secret: string, timestamp: string|null, error: string|null }}
 */
function pecDecode(etagHeader, cacheSeedHex) {
  try {
    // ── STEP 1: Validate the Apache ETag format ──────────────────────────
    // Must match exactly: W/"<hex>-<hex>-<hex>"
    const etagRegex = /^W\/"([0-9a-f]+)-([0-9a-f]+)-([0-9a-f]*)\"$/i;
    const match = etagHeader.trim().match(etagRegex);

    if (!match) {
      return { success: false, secret: null, timestamp: null, error: 'INVALID_ETAG_FORMAT' };
    }

    // ── STEP 2: Reassemble the 3-part hex into a single hex string ───────
    const fullHex = match[1] + match[2] + match[3];

    // ── STEP 3: Convert hex string back to bytes ─────────────────────────
    const cipheredBytes = Buffer.from(fullHex, 'hex');

    // ── STEP 4: Parse the biometric key from X-Cache-Seed header ─────────
    if (!cacheSeedHex || cacheSeedHex.length < 8) {
      return { success: false, secret: null, timestamp: null, error: 'MISSING_OR_INVALID_CACHE_SEED' };
    }
    const key = parseKeyFromHex(cacheSeedHex);

    // ── STEP 5: XOR decipher using the biometric key ──────────────────────
    const plainBytes = xorDecipher(cipheredBytes, key);

    // ── STEP 6: Decode bytes back to UTF-8 string ─────────────────────────
    const saltedText = plainBytes.toString('utf8');

    // ── STEP 7: Extract the timestamp salt and original secret ────────────
    const separator = '|PEC:';
    const idx = saltedText.lastIndexOf(separator);
    let secret = saltedText;
    let timestamp = null;

    if (idx !== -1) {
      secret = saltedText.substring(0, idx);
      timestamp = saltedText.substring(idx + separator.length);
    }

    return {
      success: true,
      secret,
      timestamp,
      error: null,
    };

  } catch (err) {
    return {
      success: false,
      secret: null,
      timestamp: null,
      error: `DECODE_EXCEPTION: ${err.message}`,
    };
  }
}

module.exports = { pecDecode };
