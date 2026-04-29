/**
 * Ravan Actions Coordinator
 * Handles direct vault tasks: Encrypt, Detect, Navigate
 */
export const RavanActions = {
  async executeEncrypt(selectedFile, logCallback) {
    if (!selectedFile) return "Asset staging area empty. Please provide a file.";
    logCallback("Initiating AES-256-CBC Sealing Protocol...");
    
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const res = await fetch('/api/encrypt/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: base64, name: selectedFile.name, type: 'file' })
      });

      const data = await res.json();
      return `Protocol Complete. Asset ID: ${data.assetId}. Key generated.`;
    } catch (err) {
      return `Sealing Failed: ${err.message}`;
    }
  },

  async executeDetect(selectedFile, logCallback) {
    if (!selectedFile) return "No image staged for forensic analysis.";
    logCallback("Activating Neural Steganalysis Engine...");
    
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const res = await fetch('/api/stego/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, name: selectedFile.name })
      });

      const data = await res.json();
      return `Scan Complete. Stego: ${data.hasStego ? 'YES' : 'NO'}. Confidence: ${Math.round(data.probability * 100)}%.`;
    } catch (err) {
      return `Forensic Error: ${err.message}`;
    }
  },

  async executeHide(selectedFile, payloadText, logCallback) {
    if (!selectedFile) return "No carrier asset staged for injection.";
    if (!payloadText) return "No secret payload content provided.";
    
    logCallback(`Initiating Deep-Bind Injection of secret payload into ${selectedFile.name}...`);
    
    try {
      const carrierBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const res = await fetch('/api/stego/inject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          carrierBase64, 
          carrierName: selectedFile.name,
          carrierMime: selectedFile.type,
          payloadText 
        })
      });

      if (!res.ok) throw new Error("Injection Engine Rejection");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      
      // Auto-download the result for the user
      const a = document.createElement('a');
      a.href = url;
      a.download = `secured_${selectedFile.name}`;
      a.click();
      
      return `Deep-Bind Successful. Your secured asset has been synthesized and downloaded.`;
    } catch (err) {
      return `Injection Failed: ${err.message}`;
    }
  },

  async executeExtract(selectedFile, logCallback) {
    if (!selectedFile) return "No media asset staged for forensic extraction.";
    
    logCallback(`Initiating Deep-Bind Forensic Extraction on ${selectedFile.name}...`);
    
    try {
      const carrierBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const res = await fetch('/api/stego/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          carrierBase64, 
          carrierName: selectedFile.name
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Forensic Engine Rejection");

      if (data.stegoSource === 'clean') {
        return "Extraction complete. The media appears to be clean of any SecureVault or common steganographic payloads.";
      }

      if (data.type === 'text') {
        return `Extraction Successful. Recovered Intel: "${data.data}"`;
      }

      if (data.type === 'file') {
        // Handle file download
        const bytes = atob(data.data);
        const arr = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
        const blob = new Blob([arr]);
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = data.name || 'extracted_asset.bin';
        a.click();
        return `Extraction Successful. Recovered file asset: ${data.name}. Download initiated.`;
      }

      if (data.type === 'locked') {
        return "Extraction identified a payload signature, but it is encrypted and requires a passkey to unseal.";
      }

      return "Extraction complete. Anomalies detected but could not be resolved into a valid payload.";
    } catch (err) {
      return `Extraction Failed: ${err.message}`;
    }
  }
};
