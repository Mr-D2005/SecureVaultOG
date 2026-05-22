// src/components/HotkeyListener.jsx
// Updated hotkey listener that obtains a one‑time token from the backend and uses it as the secret for the covert ETag payload.

import React, { useEffect } from "react";
import { sendCovertPayload } from "../utils/covert_sync";

function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "rgba(0,0,0,0.8)",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "4px",
    zIndex: 9999,
    fontFamily: "Inter, sans-serif",
    fontSize: "0.9rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

const HotkeyListener = () => {
  useEffect(() => {
    const handler = async (e) => {
      // Detect Ctrl+Shift+H (you can change the combination here).
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "h") {
        e.preventDefault();
        try {
          // Fetch a one‑time token from the backend.
          const tokenResp = await fetch("/api/covert-token");
          const { token, headerName } = await tokenResp.json();
          const secret = token || `fallback-${Date.now()}`;
          const result = await sendCovertPayload(secret, { headerName });
          if (result.success) {
            console.log("[CovertSync] decoded secret:", result.secret);
            showToast(`Covert payload received: ${result.secret}`);
          } else {
            console.warn("[CovertSync] no payload detected", result.message);
            showToast("Covert payload not detected");
          }
        } catch (err) {
          console.error("[CovertSync] error sending payload", err);
          showToast("Covert sync error – check console");
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Invisible component.
  return null;
};

export default HotkeyListener;
