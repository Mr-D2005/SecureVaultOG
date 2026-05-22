// src/utils/header_randomizer.js
// Generate a random, short‑lived custom header name for each session.
// The server returns the name as part of the token response.

export function generateHeaderName() {
  const arr = new Uint8Array(4);
  crypto.getRandomValues(arr);
  // Example: x-a9f3c2d1
  return 'x-' + [...arr].map(b => b.toString(16).padStart(2, '0')).join('');
}

export function applyHeader(headersObj, headerName, value) {
  headersObj[headerName] = value;
}
