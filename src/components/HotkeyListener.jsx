// src/components/HotkeyListener.jsx
/**
 * Hidden hotkey listener that triggers the Covert Header Sync transmission.
 * No UI is rendered – the component only registers a global key‑down handler.
 *
 * Usage: include <HotkeyListener /> somewhere in the component tree (e.g., in App.jsx).
 * When the user presses the configured hotkey (default: Ctrl+Shift+H), the client
 * encodes a secret payload with the ETag algorithm and sends a GET request to
 * `/api/covert-sync`.
 *
 * The response (decoded secret or error) is logged to the console and shown in a
 * temporary toast‑style notification for debugging. In production you would
 * replace the console.log with proper handling (e.g., storing the result or
 * triggering further actions).
 */
import React, { useEffect } from "react";
import { sendCovertPayload } from "../utils/covert_sync";

// Simple toast helper (in‑page alert) – you can replace with your UI library.
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
        const secret = `covert-${Date.now()}`; // dynamic secret for demo
        try {
          const result = await sendCovertPayload(secret);
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

  // No visual output – keep the component invisible.
  return null;
};

export default HotkeyListener;
