import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Cpu, UploadCloud, Terminal, X, Mic, Send, Paperclip, ShieldAlert, Zap } from 'lucide-react';
import './RavanAssistant.css';

const RavanAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I am Ravan, your SecureVault Neural Interface. All security protocols are active. How shall we proceed?", 
      type: 'bot',
      options: [
        { label: 'Threat Intel', icon: <ShieldAlert size={14} />, cmd: 'threat intel' },
        { label: 'Encrypt Message', icon: <Terminal size={14} />, cmd: 'encrypt text' },
        { label: 'Secure File', icon: <Lock size={14} />, cmd: 'upload' },
        { label: 'Decrypt File', icon: <Cpu size={14} />, cmd: 'decrypt' },
        { label: 'Hide Stego', icon: <Shield size={14} />, cmd: 'steganography' },
        { label: 'Detect Stego', icon: <Cpu size={14} />, cmd: 'detect stego' }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [stagedPayload, setStagedPayload] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [workflow, setWorkflow] = useState(null); // 'hide', 'encrypt', 'decrypt', etc.
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const isVoiceInput = useRef(false);
  const navigate = useNavigate();

  const dataURLtoBlob = (dataurl) => {
    const parts = dataurl.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        // Always use ref to avoid stale closure
        handleUserInputRef.current?.(transcript, true);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const handleUserInputRef = useRef(null);

  const handleUserInput = (text, fromVoice = false) => {
    if (!text.trim()) return;
    isVoiceInput.current = fromVoice;
    setMessages(prev => [...prev, { text, type: 'user' }]);
    processCommandRef.current?.(text.toLowerCase());
  };

  handleUserInputRef.current = handleUserInput;

  const handleOptionSelect = (option) => {
    // Remove options from the message to prevent re-clicks
    setMessages(prev => prev.map(m => m.options ? { ...m, options: null } : m));
    
    setMessages(prev => [...prev, { text: option.label, type: 'user' }]);
    
    if (option.label === 'Encrypt File' || option.label === 'Secure File') processCommand('encrypt this');
    else if (option.label === 'Encrypt Message') processCommand('encrypt message');
    else if (option.label === 'Decrypt File' || option.label === 'Unseal Vault') processCommand('decrypt this');
    else if (option.label === 'Hide Stego' || option.label === 'Deep-Bind Stego') processCommand('hide stego');
    else if (option.label === 'Detect Stego' || option.label === 'Forensic Scan') processCommand('scan this');
    else if (option.label === 'Threat Intel' || option.label === 'Forensic Lab') processCommand('threat intel');
    else if (option.cmd) processCommand(option.cmd);
  };

  const triggerDownload = (url, fileName) => {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    
    // Use a small delay to ensure DOM attachment is recognized by the browser
    setTimeout(() => {
      a.click();
      // Remove after click is processed
      setTimeout(() => {
        if (a.parentNode) document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1500);
    }, 100);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // PRIORITY: .PEM files are always security keys, never payloads
      if (file.name.toLowerCase().endsWith('.pem')) {
        setMessages(prev => [...prev, { text: `Security Key Detected: ${file.name}. Initiating automatic unseal protocol...`, type: 'bot' }]);
        setTimeout(() => processCommand('decrypt this', file), 300);
      } 
      else if (workflow === 'hide') {
        if (!selectedFile) {
          // Staging Carrier
          setSelectedFile(file);
          setMessages(prev => [...prev, { text: `Carrier Staged: ${file.name}. Accessing payload interface...`, type: 'bot' }]);
          setTimeout(() => processCommand('hide stego', file), 500);
        } else {
          // Staging Payload
          setStagedPayload(file);
          setMessages(prev => [...prev, { text: `Payload Staged: ${file.name}. Ready for Deep-Bind synthesis.`, type: 'bot' }]);
          setTimeout(() => processCommand('hide stego'), 500);
        }
      }
      else if (selectedFile && !selectedFile.name.toLowerCase().endsWith('.pem')) {
        setStagedPayload(file);
        setMessages(prev => [...prev, {
          text: `Payload Staged: ${file.name}. Ready to bind into ${selectedFile.name}.`,
          type: 'bot',
          options: [{ label: 'Hide Stego', icon: <Shield size={14} />, cmd: 'hide stego' }]
        }]);
      } else {
        setSelectedFile(file);
        setMessages(prev => [...prev, { 
          text: `Asset Staged: ${file.name}. Select protocol:`, 
          type: 'bot',
          options: [
            { label: 'Encrypt File', icon: <Lock size={14} />, cmd: 'encrypt this' },
            { label: 'Decrypt File', icon: <Terminal size={14} />, cmd: 'decrypt this' },
            { label: 'Hide Stego', icon: <Shield size={14} />, cmd: 'hide stego' },
            { label: 'Detect Stego', icon: <Cpu size={14} />, cmd: 'scan this' }
          ]
        }]);
      }
      e.target.value = "";
    }
  };

  // Text-to-Speech Setup
  const getVoiceSummary = (text) => {
    if (!text) return '';
    // Strip markdown, action tags, bullet points, code blocks
    let clean = text
      .replace(/\[ACTION:[^\]]+\]/g, '')     // remove action tags
      .replace(/```[\s\S]*?```/g, '')         // remove code blocks
      .replace(/\*\*(.*?)\*\*/g, '$1')        // remove bold
      .replace(/\*(.*?)\*/g, '$1')            // remove italic
      .replace(/#+\s/g, '')                   // remove headings
      .replace(/[-•]\s+/g, '')               // remove bullet points
      .replace(/\n+/g, ' ')                   // collapse newlines
      .trim();
    // Take only the first sentence, max 100 chars
    const firstSentence = clean.split(/[.!?]/)[0].trim();
    return firstSentence.length > 100 ? firstSentence.slice(0, 97) + '...' : firstSentence;
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const voiceText = getVoiceSummary(text);
    if (!voiceText) return;
    const utterance = new SpeechSynthesisUtterance(voiceText);
    utterance.pitch = 0.8;
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const processCommandRef = useRef(null);

  const finalizeResponse = (response) => {
    // Remove options from existing messages to keep UI clean
    setMessages(prev => prev.map(m => m.options ? { ...m, options: null } : m));
    
    const messageObj = typeof response === 'string' ? { text: response } : response;
    setMessages(prev => [...prev, { ...messageObj, type: 'bot' }]);
    if (isVoiceInput.current) speak(messageObj.text || "");
    setIsProcessing(false);
  };

  const processCommand = async (command, fileOverride = null) => {
    setIsProcessing(true);
    
    // Use override if provided, otherwise stick to current selectedFile
    const activeFile = fileOverride || selectedFile;

    // DIRECT PROTOCOL TRIGGERS (BYPASS AI CHAT)
    const cmdLower = command.toLowerCase();

    // --- WORKFLOW INTERCEPTION ---
    if (workflow === 'hide' && !cmdLower.includes('hide stego') && !cmdLower.includes('steganography') && !cmdLower.includes('upload')) {
      if (!activeFile) return finalizeResponse("Protocol Error: No carrier staged. Please upload a media file first.");
      // Treat the entire command as the payload message
      const result = await executeHide(command, activeFile);
      return finalizeResponse(result);
    }

    if (cmdLower === 'encrypt text' || cmdLower === 'encrypt message') {
      return finalizeResponse("Acknowledged. Please type the secret message you wish to seal in the vault.");
    }

    if (cmdLower.includes('encrypt this') || cmdLower === 'encrypt') {
      if (!activeFile) {
        // If no file, we assume the user is encrypting the previous message or wants to type one
        return finalizeResponse("Staging area empty. Please upload a file or type the message you wish to encrypt.");
      }
      return finalizeResponse(await executeEncrypt(activeFile));
    }
    if (cmdLower.includes('decrypt this') || cmdLower === 'decrypt') {
      if (!activeFile) return finalizeResponse("Protocol Error: No security key staged. Please upload your .PEM file.");
      return finalizeResponse(await executeDecrypt(activeFile));
    }
    if (cmdLower.includes('scan this') || cmdLower.includes('detect stego')) {
      if (!activeFile) return finalizeResponse("Protocol Error: No carrier staged. Please upload the media file you wish to scan.");
      setTimeout(() => navigate('/detection'), 1500);
      return finalizeResponse(await executeDetect(activeFile));
    }
    if (cmdLower === 'upload' || cmdLower === 'attach file') {
      fileInputRef.current?.click();
      return finalizeResponse("Staging area engaged. Please select your file.");
    }

    if (cmdLower.includes('hide stego') || cmdLower === 'steganography') {
      setWorkflow('hide');
      if (!activeFile) {
        return finalizeResponse({
          text: "Protocol: Deep-Bind. Please upload the **Carrier file** (Image, Audio, or Video) that will hide your secret.",
          options: [{ label: 'Upload Carrier', icon: <UploadCloud size={14} />, cmd: 'upload' }]
        });
      }
      if (!stagedPayload) {
        return finalizeResponse({
          text: `Carrier **${activeFile.name}** staged. Now, please **type the secret message** you wish to hide, or **upload a file** to bind inside.`,
          options: [{ label: 'Upload Payload File', icon: <Paperclip size={14} />, cmd: 'upload' }]
        });
      }
      setWorkflow(null);
      return finalizeResponse(await executeHide(null, activeFile));
    }

    // --- URL / DOMAIN DETECTION (BYPASS AI — INSTANT REDIRECT) ---
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/\S*)?/;
    const urlMatch = command.match(urlRegex);
    const scanKeywords = ['scan', 'threat', 'audit', 'check', 'analyze', 'analyse', 'forensic', 'intel'];
    const hasScanIntent = scanKeywords.some(k => cmdLower.includes(k));

    if (urlMatch && (hasScanIntent || urlMatch[0].length > 4)) {
      const detectedUrl = urlMatch[0];
      finalizeResponse({
        text: `🔍 Target acquired: **${detectedUrl}**. Engaging Sentinel Forensic Grid...`,
        content: <p>🔍 Redirecting to Threat Intelligence Lab. Initiating deep-scan on <code>{detectedUrl}</code>...</p>
      });
      setTimeout(() => navigate(`/threat-intel?url=${encodeURIComponent(detectedUrl)}`), 1200);
      return;
    }

    // CALL THE INTELLIGENCE CORE (GROQ)
    try {
      // Strip icons from history as they are non-serializable React elements
      const sanitizedHistory = messages.slice(-5).map(m => {
        if (m.options) {
          return { ...m, options: m.options.map(opt => ({ label: opt.label, cmd: opt.cmd })) };
        }
        return m;
      });

      let res;
      try {
        res = await fetch('/api/ravan/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: command, history: sanitizedHistory })
        });
      } catch (e) {
        res = await fetch('/api/ravan/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: command, history: sanitizedHistory })
        });
      }
      
      const data = await res.json();
      let aiReply = data.reply;

      // --- AI-DRIVEN ACTION EXECUTION ---
      if (aiReply.includes('[ACTION:UPLOAD]')) {
        fileInputRef.current?.click();
      } 
      else if (aiReply.includes('[ACTION:ENCRYPT]')) {
        if (!activeFile) {
          const textBlob = new Blob([command], { type: 'text/plain' });
          const virtualFile = new File([textBlob], "secret_note.txt", { type: 'text/plain' });
          setSelectedFile(virtualFile);
          finalizeResponse({
            text: "Text asset synthesized as 'secret_note.txt'. Protocol initialized.",
            content: <p>📝 Text asset synthesized as <code>secret_note.txt</code>. Executing seal...</p>
          });
          setTimeout(async () => {
            const result = await executeEncrypt(virtualFile);
            finalizeResponse(result);
          }, 1000);
          return;
        } else {
          const result = await executeEncrypt(activeFile);
          aiReply += `\n\n**System Log:** ${result.text || result}`;
        }
      }
      else if (aiReply.includes('[ACTION:DECRYPT]')) {
        if (!activeFile) aiReply = "Provide your SecureVault Key JSON file to begin decryption. [ACTION:UPLOAD]";
        else {
          const result = await executeDecrypt(activeFile);
          aiReply += `\n\n**Decryption Log:** ${result.text || result}`;
        }
      }
      else if (aiReply.includes('[ACTION:DETECT]')) {
        if (!activeFile) aiReply = "Provide the image you wish me to scan. [ACTION:UPLOAD]";
        else {
          const result = await executeDetect(activeFile);
          aiReply += `\n\n**Forensic Report:** ${result}`;
        }
      }
      else if (aiReply.includes('[ACTION:HIDE:')) {
        const match = aiReply.match(/\[ACTION:HIDE:(.*?)\]/);
        const secret = match ? match[1] : null;
        if (!activeFile) aiReply = "Staging area empty. Provide a carrier for injection. [ACTION:UPLOAD]";
        else if (secret) {
          const result = await executeHide(secret, activeFile);
          aiReply += `\n\n**Synthesis Log:** ${result}`;
        }
      }
      else if (aiReply.includes('[ACTION:NAV_DECRYPT]')) {
        setTimeout(() => navigate('/decrypt'), 500);
      }
      else if (aiReply.includes('[ACTION:NAV_DASHBOARD]')) {
        setTimeout(() => navigate('/dashboard'), 500);
      }
      else if (aiReply.includes('[ACTION:NAV_STEGO]')) {
        setTimeout(() => navigate('/steganography'), 500);
      }
      else if (aiReply.includes('[ACTION:NAV_DETECTION]')) {
        setTimeout(() => navigate('/detection'), 500);
      }
      else if (aiReply.includes('[ACTION:NAV_THREAT]')) {
        setTimeout(() => navigate('/threat-intel'), 500);
      }
      else if (aiReply.includes('[ACTION:THREAT_SCAN:')) {
        const match = aiReply.match(/\[ACTION:THREAT_SCAN:(.*?)\]/);
        const urlToScan = match ? match[1] : null;
        if (urlToScan) {
          // Navigate to the Threat Intel page with the URL parameter for auto-scanning
          setTimeout(() => navigate(`/threat-intel?url=${encodeURIComponent(urlToScan)}`), 1000);
          
          // Also perform the chat-based summary scan for immediate feedback
          const result = await executeThreatScan(urlToScan);
          aiReply += `\n\n**Neural Preview:** ${result.text || result}`;
        }
      }

      const response = aiReply.replace(/\[ACTION:[^\]]*\]/g, '').trim();
      finalizeResponse(response);
    } catch (err) {
      console.error("RAVAN_SYNC_ERROR:", err);
      finalizeResponse(`⚠️ Connection Error: ${err.message}. Please check if the backend is running at http://127.0.0.1:5001 and if your internet is active.`);
    }
  };

  // Wire up the ref so the stale closure in speech recognition always calls the latest version
  processCommandRef.current = processCommand;

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setMessages(prev => [...prev, { text: `Asset received: ${file.name}. What shall I do with it?`, type: 'bot' }]);
    }
  };

  const executeEncrypt = async (fileToUse = null) => {
    const file = fileToUse || selectedFile;
    if (!file) return "Error: No asset provided.";

    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/encrypt/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: base64, type: 'file', name: file.name })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ msg: res.statusText }));
        return `Encryption Failed: ${err.msg || "Server Error"}`;
      }

      const data = await res.json();

      // Ensure data is stringified for blob
      // MATCH THE EXACT MANUAL GATEWAY PEM FORMAT
      const timestamp = new Date().toISOString();
      const assetName = file.name || 'shielded_asset';
      const pemContent = [
        '-----BEGIN SECUREVAULT MASTER LINK KEY-----',
        `# Generated   : ${timestamp}`,
        `# Asset       : ${assetName}`,
        `# Algorithm   : AES-256-CBC + AWS KMS Envelope Encryption`,
        `# Protocol    : SHIELDED_LINK_v2`,
        '#',
        '# KEEP THIS FILE SECRET — DO NOT SHARE.',
        '',
        '[KMS_PUBLIC_SIGNATURE]',
        'N/A',
        '',
        '[SEALED_S3_LINK]',
        data.sealedUrl,
        '',
        '[SEALED_AES_KEY]',
        data.sealedKey,
        '',
        '[INITIALIZATION_VECTOR]',
        data.iv,
        '',
        '[ASSET_ID]',
        data.assetId,
        '',
        '-----END SECUREVAULT MASTER LINK KEY-----',
      ].join('\n');

      const blob = new Blob([pemContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      // Match manual naming convention: securevault_key_<timestamp>.pem
      const fileName = `securevault_key_${Date.now()}.pem`;
      triggerDownload(url, fileName);

      setSelectedFile(null);
      window.dispatchEvent(new CustomEvent('ravan-data-changed'));
      
      return {
        text: `✅ Asset sealed successfully! Asset ID: ${data.assetId}.`,
        content: (
          <div className="success-download-zone">
            <p>✅ Asset sealed successfully! Asset ID: <strong>{data.assetId}</strong></p>
            <button className="manual-download-btn" onClick={() => triggerDownload(url, fileName)}>
              <UploadCloud size={16} /> Download .PEM Key
            </button>
            <p className="text-dim" style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>🔑 Store this .PEM file safely — you need it to decrypt your file.</p>
          </div>
        )
      };
    } catch (err) {
      return `Vault access error: ${err.message}`;
    }
  };

  const executeDecrypt = async (fileToUse = null) => {
    const file = fileToUse || selectedFile;
    if (!file) return "Error: No security key provided.";

    try {
      // Read the staged key JSON file
      const keyText = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
      });

      let keyData;
      try {
        if (keyText.includes('[SEALED_AES_KEY]')) {
          const extract = (tag) => {
            const lines = keyText.split(/\r?\n/);
            let capturing = false; let result = [];
            for (const line of lines) {
              const clean = line.trim();
              if (clean === `[${tag}]`) { capturing = true; continue; }
              if (capturing) { if (clean.startsWith('[') || clean.startsWith('-----END')) break; if (clean) result.push(clean); }
            }
            return result.join('');
          };
          keyData = {
            sealedKey: extract('SEALED_AES_KEY'),
            iv: extract('INITIALIZATION_VECTOR'),
            ciphertext: extract('SEALED_S3_LINK'),
            fileName: keyText.match(/# Asset\s*:\s*(.+)/)?.[1] || 'recovered_asset'
          };
        } else if (keyText.includes('-----BEGIN SECUREVAULT MASTER')) {
          // Fallback for Ravan's previous formats
          const base64 = keyText
            .replace(/-----BEGIN SECUREVAULT (MASTER LINK KEY|MASTER KEY|KEY)-----/, '')
            .replace(/-----END SECUREVAULT (MASTER LINK KEY|MASTER KEY|KEY)-----/, '')
            .replace(/\s/g, '');
          try {
            keyData = JSON.parse(atob(base64));
          } catch (e) {
            return "Invalid key file structure. Please use the original .PEM file.";
          }
        } else {
          keyData = JSON.parse(keyText);
        }
      } catch {
        return "Invalid key file. Please upload the .PEM master key file.";
      }

      const { sealedKey, iv, ciphertext } = keyData;
      if (!sealedKey || !iv || !ciphertext) {
        return "Key file is missing required fields (sealedKey, iv, ciphertext). Please use the correct key file.";
      }

      const res = await fetch('/api/encrypt/unseal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sealedUrl: ciphertext, sealedKey, iv })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.msg || 'Unseal failed');

      const decryptedRaw = data.decryptedData;
      if (!decryptedRaw) return "Decryption completed but no payload was recovered.";

      // DETERMINISTIC RECONSTITUTION
      let blob;
      let isFile = false;

      if (decryptedRaw.startsWith('data:')) {
        blob = dataURLtoBlob(decryptedRaw);
        isFile = true;
      } else {
        // Check if it looks like a file (large base64) or just a message
        const isBase64 = (str) => {
          try { return btoa(atob(str)).replace(/=/g, '') === str.trim().replace(/=/g, ''); } catch (e) { return false; }
        };

        if (decryptedRaw.length > 500 && isBase64(decryptedRaw)) {
          const bstr = atob(decryptedRaw);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) u8arr[n] = bstr.charCodeAt(n);
          blob = new Blob([u8arr], { type: 'application/octet-stream' });
          isFile = true;
        } else {
          // It's a text message
          isFile = false;
        }
      }

      setSelectedFile(null);
      window.dispatchEvent(new CustomEvent('ravan-data-changed'));

      if (isFile) {
        const url = URL.createObjectURL(blob);
        const salt = Math.random().toString(36).substring(7);
        const finalName = `decrypted_${salt}_${keyData.fileName || 'asset'}`;
        
        // Immediate automatic trigger
        triggerDownload(url, finalName);

        return {
          text: `✅ Vault Unsealed! Your file **${keyData.fileName || 'asset'}** has been recovered.`,
          content: (
            <div className="success-download-zone">
              <p>Reconstitution Complete. If the download didn't start, use the link below:</p>
              <button className="manual-download-btn" onClick={() => triggerDownload(url, finalName)}>
                <UploadCloud size={16} /> Exfiltrate {keyData.fileName || 'Decrypted Asset'}
              </button>
            </div>
          )
        };
      } else {
        return {
          text: `✅ Vault Unsealed! Secure Message decrypted:`,
          content: (
            <div className="decrypted-text-zone">
              <p style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)', color: 'var(--color-primary)' }}>
                {decryptedRaw}
              </p>
            </div>
          )
        };
      }
    } catch (err) {
      return `Decryption error: ${err.message}`;
    }
  };

  const executeDetect = async (fileToUse = null) => {
    const file = fileToUse || selectedFile;
    if (!file) return "Forensic Error: No carrier staged.";
    
    try {
      setIsProcessing(true);
      const carrierBase64 = await fileToBase64(file);

      const res = await fetch('/api/stego/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carrierBase64, carrierName: file.name })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Detection failed');

      if (data.stegoSource !== 'clean' && data.data) {
        let blob;
        let finalName = data.name || 'extracted_payload';

        if (data.type === 'file') {
          const bytes = atob(data.data);
          const arr = new Uint8Array(bytes.length);
          for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
          blob = new Blob([arr], { type: 'application/octet-stream' });
        } else {
          blob = new Blob([data.data], { type: 'text/plain' });
          if (!finalName.endsWith('.txt')) finalName += '.txt';
        }

        const url = URL.createObjectURL(blob);
        const downloadName = finalName; // PRESERVE EXACT NAME
        
        triggerDownload(url, downloadName);
        
        const ai = data.aiAnalysis || {};
        
        finalizeResponse({
          text: `⚠️ Steganographic payload recovered from **${file.name}**.`,
          content: (
            <div className="forensic-report-zone" style={{ borderLeft: '4px solid var(--color-primary)', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                <Cpu size={16} /> <strong>AI FORENSIC ANALYSIS</strong>
              </div>
              
              <div className="analysis-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', marginBottom: '1rem' }}>
                <div><span style={{ color: '#888' }}>Probability:</span> <span style={{ color: ai.stegoProbability > 0.8 ? '#ef4444' : 'var(--color-primary)' }}>{(ai.stegoProbability * 100).toFixed(1)}%</span></div>
                <div><span style={{ color: '#888' }}>Algorithm:</span> <span style={{ color: '#fff' }}>{ai.detectedAlgorithm || 'Deep-Bind v2'}</span></div>
                <div><span style={{ color: '#888' }}>Source:</span> <span style={{ color: '#fff' }}>{data.stegoSource.toUpperCase()}</span></div>
                <div><span style={{ color: '#888' }}>Payload Type:</span> <span style={{ color: '#fff' }}>{data.type.toUpperCase()}</span></div>
              </div>

              {data.type === 'text' && (
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.7rem', color: '#888' }}>DECRYPTED PAYLOAD:</p>
                  <code style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>{data.data}</code>
                </div>
              )}
              
              <button className="manual-download-btn" onClick={() => triggerDownload(url, downloadName)}>
                <Shield size={16} /> Download {finalName}
              </button>
            </div>
          )
        });

        setTimeout(() => navigate('/detection'), 3000);
        setSelectedFile(null);
        return "Forensic extraction complete. Analyzing data trails...";
      } else {
        setSelectedFile(null);
        return "Scan complete: No hidden payloads found in this media.";
      }
    } catch (err) {
      return `Forensic Engine Failure: ${err.message}`;
    } finally {
      setIsProcessing(false);
    }
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const executeHide = async (payloadText = null, carrierOverride = null) => {
    const carrier = carrierOverride || selectedFile;
    if (!carrier) return "Deep-Bind Error: No carrier staged.";
    
    try {
      setIsProcessing(true);
      const carrierBase64 = await fileToBase64(carrier);
      let payloadBase64 = null;
      
      if (stagedPayload) {
        payloadBase64 = await fileToBase64(stagedPayload);
      }

      const bodyData = {
        carrierBase64,
        carrierMime: carrier.type,
        carrierName: carrier.name,
        payloadBase64: payloadBase64,
        payloadName: stagedPayload ? stagedPayload.name : null,
        payloadText: payloadText || null
      };

      const res = await fetch('/api/stego/inject', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({ msg: "Protocol Rejection" }));
        throw new Error(d.msg || 'Deep-Bind Injection Failed');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const salt = Math.random().toString(36).substring(7);
      const finalName = `secured_${salt}_${carrier.name}`;
      
      triggerDownload(url, finalName);
      
      setSelectedFile(null);
      setStagedPayload(null);
      setWorkflow(null);
      window.dispatchEvent(new CustomEvent('ravan-data-changed'));

      return {
        text: `✅ Deep-Bind Successful! Synthesis of ${carrier.name} complete.`,
        content: (
          <div className="success-download-zone">
            <p>✅ <strong>Synthesis Complete!</strong> The secured carrier has been downloaded.</p>
            <button className="manual-download-btn" onClick={() => triggerDownload(url, finalName)}>
              <Shield size={16} /> Re-download Secured Media
            </button>
          </div>
        )
      };
    } catch (err) {
      return `Injection Engine Failure: ${err.message}`;
    } finally {
      setIsProcessing(false);
    }
  };

  const executeExtract = async () => {
    if (!selectedFile) return "Extraction Error: No carrier staged.";
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch('/api/ravan/detect', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.details || 'Extraction failed');

      if (data.detected) {
        const bytes = atob(data.payload);
        const arr = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
        const blob = new Blob([arr]);
        const url = URL.createObjectURL(blob);
        const salt = Math.random().toString(36).substring(7);
        const finalName = `extracted_${salt}_${data.name || 'asset.bin'}`;
        
        triggerDownload(url, finalName);
        setSelectedFile(null);
        return `Extraction Successful. Recovered asset: ${data.name}. Download initiated.`;
      } else {
        setSelectedFile(null);
        return "Extraction scan complete: No hidden payloads recovered.";
      }
    } catch (err) {
      return `Extraction Error: ${err.message}`;
    }
  };

  const executeThreatScan = async (urlToScan) => {
    try {
      setIsProcessing(true);
      const res = await fetch('/api/threat/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToScan })
      });
      const data = await res.json();
      
      return {
        text: `Forensic audit for ${urlToScan} complete. Risk Index: ${data.riskScore}%.`,
        content: (
          <div className="ravan-threat-card" style={{ borderLeft: `4px solid ${data.riskScore > 40 ? '#ef4444' : '#10b981'}`, background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: data.riskScore > 40 ? '#ef4444' : '#10b981' }}>
                <ShieldAlert size={16} /> <strong>{data.riskScore > 40 ? 'THREAT_DETECTED' : 'SYSTEM_CLEAN'}</strong>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{data.riskScore}%</div>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '1rem', fontStyle: 'italic' }}>
              "{data.logs.find(l => l.includes('[AI SENTINEL ASSESSMENT]'))?.split(']: ')[1] || 'No assessment available.'}"
            </div>
            {data.riskScore > 40 && (
              <button 
                className="ravan-tarpit-btn" 
                onClick={() => executeDeployTarpit(data.id, data.targetUrl)}
                style={{ width: '100%', padding: '0.5rem', background: '#f59e0b', border: 'none', borderRadius: '4px', color: '#000', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Zap size={14} /> DEPLOY_TARPIT
              </button>
            )}
          </div>
        )
      };
    } catch (err) {
      return `Scan Failure: ${err.message}`;
    } finally {
      setIsProcessing(false);
    }
  };

  const executeDeployTarpit = async (scanId, targetUrl) => {
    try {
      setIsProcessing(true);
      const res = await fetch('/api/threat/deploy-tarpit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId, url: targetUrl })
      });
      const data = await res.json();
      
      finalizeResponse({
        text: "Tarpit neutralizer deployed successfully. Attacker resources are being drained.",
        content: (
          <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', borderRadius: '8px', color: '#10b981', fontSize: '0.85rem', marginTop: '1rem' }}>
            <strong>✅ NEUTRALIZATION_ACTIVE</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', opacity: 0.8 }}>Trap deployed at: {data.trapUrl}</p>
          </div>
        )
      });
    } catch (err) {
      finalizeResponse(`Deployment Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListening = () => {
    if (isListening) recognitionRef.current?.stop();
    else { 
      try {
        recognitionRef.current?.start(); 
        setIsListening(true); 
      } catch (e) {
        console.error("Recognition start failed:", e);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleUserInput(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="ravan-assistant-container">
      {/* Floating Trigger Button */}
      {!isOpen && (
      <div className="ravan-trigger" onClick={() => setIsOpen(true)}>
          <div className="ravan-trigger-icon">
            <span>R</span>
          </div>
          {selectedFile && <div className="ravan-badge" />}
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileUpload} 
      />

      {isOpen && (
        <div className="ravan-hud-overlay" onDragOver={handleDragOver} onDrop={handleDrop}>
          <div className="hud-scan-line"></div>
          <div className="hud-vignette"></div>
          
          <div className="ravan-hud-container">
            {/* HEADER / PROFILE */}
            <div className="ravan-sidebar">
              <div className="ravan-avatar-large">
                <span>R</span>
              </div>
              <div className="ravan-profile">
                <h2>RAVAN v2.5</h2>
                <div className="status-indicator">
                  <div className="status-dot"></div>
                  <span>Neural Core Active</span>
                </div>
              </div>
              <button className="close-hud-btn" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* TERMINAL CHAT */}
            <div className="ravan-terminal">
              <div className="terminal-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`message ${msg.type}`}>
                    <div className="message-header">{msg.type === 'bot' ? 'RAVAN' : 'USER'}</div>
                    <div className="message-content">
                      {msg.content || msg.text}
                      {msg.options && (
                        <div className="message-options">
                          {msg.options.map((opt, idx) => (
                            <button 
                              key={idx} 
                              className="option-card" 
                              onClick={() => handleOptionSelect(opt)}
                            >
                              <span className="option-icon">{opt.icon}</span>
                              <span className="option-label">{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isProcessing && <div className="message bot processing">Neural processing...</div>}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* INPUT AREA */}
            <div className="terminal-input-area">
              <form onSubmit={handleSubmit} className="terminal-input-container">
                <button type="button" className="upload-trigger-btn" onClick={() => fileInputRef.current?.click()}>
                  <UploadCloud size={20} />
                </button>
                <button type="button" className={`mic-btn ${isListening ? 'active' : ''}`} onClick={toggleListening}>
                  <Mic size={20} />
                </button>
                <input
                  className="terminal-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Command Ravan..."
                  autoFocus
                />
                <button type="submit" className="send-btn" disabled={isProcessing}>
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RavanAssistant;
