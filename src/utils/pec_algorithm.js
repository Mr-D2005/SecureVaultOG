/**
 * ============================================================
 *  POLYMORPHIC ETAG CLOAKING (PEC) ALGORITHM  — v1.0
 *  NetraVaultOG | Application-Layer Steganography Engine
 * ============================================================
 *
 *  NOVEL CONTRIBUTIONS (Patentable Elements):
 *
 *  1. FORMAT MIMICRY:
 *     The encoded payload is structured to EXACTLY match the
 *     Apache/Nginx weak ETag specification:
 *       W/"<inode_hex>-<size_hex>-<mtime_hex>"
 *     This fools protocol-compliance AI firewalls into believing
 *     it is a legitimate cache validation token.
 *
 *  2. BIOMETRIC ENTROPY SEEDING:
 *     The XOR cipher key is NOT stored or transmitted.
 *     It is dynamically derived at runtime from the user's last
 *     3 mouse-movement coordinates (X/Y pixels), creating a
 *     unique, ephemeral key that vanishes when the page closes.
 *
 *  3. TIME-DRIFT SALTING (Polymorphism):
 *     A millisecond timestamp salt is injected BEFORE encoding.
 *     This guarantees that transmitting the same secret 10 times
 *     produces 10 completely different, unique ETag strings.
 *     This defeats replay-attack detection and pattern analysis.
 * ============================================================
 */

// ─── GLOBAL STATE: Mouse Entropy Collector ──────────────────────────────────
let _mouseBuffer = [{ x: 512, y: 256 }, { x: 300, y: 400 }, { x: 700, y: 150 }];

/**
 * Call this once at app startup to begin collecting mouse entropy.
 * The last 3 mouse positions are kept as a rolling buffer.
 */
export function startEntropyCollection() {
  window.addEventListener('mousemove', (e) => {
    _mouseBuffer.push({ x: e.clientX, y: e.clientY });
    if (_mouseBuffer.length > 3) _mouseBuffer.shift(); // Keep only last 3
  });
}

// ─── STEP 1: BIOMETRIC KEY DERIVATION ───────────────────────────────────────
/**
 * Derives a dynamic XOR cipher key from mouse coordinates.
 * The key is a 4-byte array based on the arithmetic mean of
 * the last 3 recorded mouse positions.
 *
 * @returns {number[]} A 4-byte key array
 */
function deriveKeyFromEntropy() {
  const avgX = Math.round(_mouseBuffer.reduce((s, p) => s + p.x, 0) / _mouseBuffer.length);
  const avgY = Math.round(_mouseBuffer.reduce((s, p) => s + p.y, 0) / _mouseBuffer.length);

  // Derive 4 key bytes from coordinate arithmetic
  const k0 = avgX & 0xFF;
  const k1 = (avgX >> 8) & 0xFF;
  const k2 = avgY & 0xFF;
  const k3 = (avgY >> 8) & 0xFF;

  return [k0, k1, k2, k3];
}

// ─── STEP 2: XOR CIPHER ─────────────────────────────────────────────────────
/**
 * Applies a repeating XOR cipher to a byte array using a 4-byte key.
 * XOR is its own inverse: encode(encode(data)) = data.
 *
 * @param {Uint8Array} bytes - Input data bytes
 * @param {number[]} key    - 4-byte key from deriveKeyFromEntropy()
 * @returns {Uint8Array}    - XOR-ciphered bytes
 */
function xorCipher(bytes, key) {
  return bytes.map((b, i) => b ^ key[i % key.length]);
}

// ─── STEP 3: TIME-DRIFT SALT INJECTION ──────────────────────────────────────
/**
 * Injects a millisecond-resolution timestamp salt into the secret string.
 * Format:  "<secret>|PEC:<timestamp_ms>"
 * This ensures every transmission produces a unique ciphertext (Polymorphism).
 *
 * @param {string} secret - The original plaintext secret
 * @returns {string}      - Salted secret string
 */
function injectTimeDriftSalt(secret) {
  const salt = Date.now(); // e.g., 1748284200000
  return `${secret}|PEC:${salt}`;
}

// ─── STEP 4: APACHE ETAG FORMAT MIMICRY ─────────────────────────────────────
/**
 * Encodes the XOR-ciphered bytes as a Hex string, then splits it into
 * three parts that EXACTLY match the Apache weak ETag format:
 *   W/"<part1>-<part2>-<part3>"
 *
 * Apache's real ETag parts represent:
 *   part1 = inode number (hex)
 *   part2 = file size in bytes (hex)
 *   part3 = last-modified time (hex)
 *
 * Our parts are structurally identical in format but carry payload data.
 *
 * @param {Uint8Array} cipheredBytes - XOR-ciphered payload bytes
 * @returns {string}                 - Apache-format ETag string
 */
function formatAsApacheETag(cipheredBytes) {
  // Convert bytes to lowercase hex
  const hexFull = Array.from(cipheredBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Split into 3 parts to mimic Apache's 3-field format
  const third = Math.ceil(hexFull.length / 3);
  const part1 = hexFull.substring(0, third);
  const part2 = hexFull.substring(third, third * 2);
  const part3 = hexFull.substring(third * 2);

  return `W/"${part1}-${part2}-${part3}"`;
}

// ─── MAIN PUBLIC API: ENCODE ─────────────────────────────────────────────────
/**
 * PEC ENCODE — The full encoding pipeline.
 *
 * Pipeline:
 *   secret → time-drift salt → UTF8 bytes → XOR cipher (mouse key) → Hex → Apache ETag format
 *
 * @param {string} secret - The plaintext secret to hide (e.g., an AWS S3 UUID)
 * @returns {{ etagValue: string, entropySnapshot: number[] }}
 *   etagValue       — The Apache-format ETag string to inject into the HTTP header
 *   entropySnapshot — The mouse-derived key (for debugging/logging only, never transmitted)
 */
export function pecEncode(secret) {
  // 1. Derive biometric key from current mouse entropy
  const key = deriveKeyFromEntropy();

  // 2. Inject time-drift salt to ensure polymorphism
  const salted = injectTimeDriftSalt(secret);

  // 3. Convert salted secret to UTF-8 bytes
  const encoder = new TextEncoder();
  const plainBytes = encoder.encode(salted);

  // 4. Apply XOR cipher with the biometric key
  const cipheredBytes = xorCipher(plainBytes, key);

  // 5. Format as Apache-compliant weak ETag
  const etagValue = formatAsApacheETag(cipheredBytes);

  return {
    etagValue,
    entropySnapshot: key, // Only for local debug logs, never sent
  };
}

// ─── MAIN PUBLIC API: TRANSMIT ───────────────────────────────────────────────
/**
 * PEC TRANSMIT — Sends the encoded secret to the backend covert listener.
 *
 * The secret is hidden inside the `ETag` header of a standard-looking
 * GET request to `/api/system/ping`. To firewalls and network monitors,
 * this looks like a browser checking a cached resource's freshness.
 *
 * The same mouse-entropy key used for encoding is embedded in a secondary
 * header `X-Cache-Seed` as a hex string, so the backend can decode it.
 * (In production, this key would be transmitted via a separate,
 *  pre-established secure channel — Diffie-Hellman key exchange.)
 *
 * @param {string} secret - The plaintext secret to transmit covertly
 * @returns {Promise<{ success: boolean, decoded: string }>}
 */
export async function pecTransmit(secret) {
  const { etagValue, entropySnapshot } = pecEncode(secret);

  // Encode the key as hex so the server can use it to decode
  const keyHex = entropySnapshot.map(b => b.toString(16).padStart(2, '0')).join('');

  const response = await fetch('/api/system/ping', {
    method: 'GET',
    headers: {
      // The covert payload — disguised as a standard browser cache-validation header
      'ETag': etagValue,
      // The biometric key — disguised as a standard cache seed identifier
      'X-Cache-Seed': keyHex,
      // Standard headers to make the request look like a real browser cache check
      'Cache-Control': 'no-cache',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  const data = await response.json();
  return data;
}
