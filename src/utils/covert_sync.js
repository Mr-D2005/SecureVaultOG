// src/utils/covert_sync.js
/**
 * Front‑end helper that sends a secret payload using the covert ETag channel.
 * It re‑uses the same encodeETag logic from src/utils/etag_algorithm.js so the
 * client and server stay in sync.
 */
import { encodeETag } from "./etag_algorithm";

/**
 * Sends a covert request to the backend.
 * @param {string} secret - Arbitrary UTF‑8 string you want to hide.
 * @param {object} [options] - Optional configuration.
 * @param {string} [options.headerName='etag'] - Header name used for the payload.
 * @returns {Promise<object>} - Resolves with the JSON response from the server.
 */
export async function sendCovertPayload(secret, options = {}) {
  const { headerName = "etag" } = options;
  const { etagValue } = encodeETag(secret);

  const response = await fetch("/api/covert-sync", {
    method: "GET",
    headers: {
      [headerName]: etagValue,
    },
    credentials: "same-origin",
  });

  // The backend returns JSON with either the decoded secret or a failure message.
  const data = await response.json();
  return data;
}
