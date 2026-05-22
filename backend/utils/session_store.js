// backend/utils/session_store.js
// Simple in‑memory store for short‑lived session info (header name, expiry, pow stamp).
// In production you would replace this with Redis or another persistent store.

const sessionMap = new Map(); // token -> { headerName, expiry }

/**
 * Store a new session.
 * @param {string} token
 * @param {string} headerName
 * @param {number} expiry Unix timestamp (seconds)
 */
function setSession(token, headerName, expiry) {
  sessionMap.set(token, { headerName, expiry });
  // Auto‑cleanup after expiry + small buffer (e.g., 60 s)
  setTimeout(() => sessionMap.delete(token), (expiry - Math.floor(Date.now() / 1000) + 60) * 1000);
}

/** Retrieve session info; returns null if missing or expired */
function getSession(token) {
  const data = sessionMap.get(token);
  if (!data) return null;
  const now = Math.floor(Date.now() / 1000);
  if (now > data.expiry) {
    sessionMap.delete(token);
    return null;
  }
  return data;
}

module.exports = { setSession, getSession };
