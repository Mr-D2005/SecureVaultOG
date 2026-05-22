// src/utils/covert_sync.js
/**
 * Front‑end helper that sends a secret payload using the patent‑ready covert ETag channel.
 * It now uses the enhanced encoder (src/utils/crypto_helper.js) which provides
 * encryption and HMAC verification on the server.
 */
import { encodeCovertTag } from "./crypto_helper";

/**
 * Sends a covert request to the backend.
 * @param {string} secret - Arbitrary UTF‑8 string you want to hide.
 * @param {object} [options]
 * @param {string} [options.headerName='etag'] - Header name for the encoded ETag.
 * @returns {Promise<object>} - Resolves with the JSON response from the server.
 */
export async function sendCovertPayload(secret, options = {}) {
  const { headerName = "etag" } = options;
  const etag = await encodeCovertTag(secret);

  const response = await fetch("/api/covert-sync", {
    method: "GET",
    headers: {
      [headerName]: etag,
    },
    credentials: "same-origin",
  });

  const data = await response.json();
  return data;
}
