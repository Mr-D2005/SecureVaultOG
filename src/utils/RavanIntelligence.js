/**
 * Ravan Intelligence Core
 * Handles AI conversation and intent detection
 */
export const RavanIntelligence = {
  async chat(message, history) {
    try {
      const res = await fetch('/api/ravan/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history })
      });

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Neural Core Connection Error:", err);
      return { 
        success: true, 
        reply: "My generative core is in fallback mode. I am ready for direct vault commands: Encrypt or Scan." 
      };
    }
  }
};
