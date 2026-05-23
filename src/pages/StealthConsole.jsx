import React, { useState } from 'react';
import { sendAdvancedCovertPayload } from '../utils/covert_sync';

// ---- Inline AES-GCM helpers (Web Crypto API) ----
async function encryptAES(plaintext) {
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plaintext));
  const rawKey = await crypto.subtle.exportKey('raw', key);
  const keyB64 = btoa(String.fromCharCode(...new Uint8Array(rawKey)));
  const ivB64  = btoa(String.fromCharCode(...iv));
  const ctB64  = btoa(String.fromCharCode(...new Uint8Array(ct)));
  return { keyB64, ivB64, ctB64 };
}

async function decryptAES(keyB64, ivB64, ctB64) {
  const rawKey = Uint8Array.from(atob(keyB64), c => c.charCodeAt(0));
  const iv     = Uint8Array.from(atob(ivB64),  c => c.charCodeAt(0));
  const ct     = Uint8Array.from(atob(ctB64),  c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('raw', rawKey, { name: 'AES-GCM' }, false, ['decrypt']);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
  return new TextDecoder().decode(plain);
}

const StealthConsole = () => {
  const [activeTab, setActiveTab] = useState('sender');
  const [secretText, setSecretText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [statusLogs, setStatusLogs] = useState([]);
  const [drops, setDrops] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [decryptedData, setDecryptedData] = useState({});

  const log = (msg) => {
    setStatusLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleExfiltrate = async () => {
    if (!secretText) return;
    setIsSending(true);
    setStatusLogs([]);
    log('Initiating covert channel sequence...');

    try {
      log('Encrypting sensitive data with AES-256-GCM...');
      const { keyB64, ivB64, ctB64 } = await encryptAES(secretText);

      // Pack as a fake S3 presigned URL (registrar sees: normal S3 URL)
      const s3Url = `https://s3.amazonaws.com/secvaults3/drop_${Date.now()}?k=${encodeURIComponent(keyB64)}&iv=${encodeURIComponent(ivB64)}&d=${encodeURIComponent(ctB64)}`;
      log(`Dead Drop packaged: ${s3Url.substring(0, 50)}...`);

      log('Executing TPM Handshake & Traffic Morphing (PEC v2)...');
      const result = await sendAdvancedCovertPayload(s3Url);

      if (result.success) {
        log('SUCCESS: S3 Dead Drop URL exfiltrated via covert ETag channel.');
        log('Firewall sees: normal GET /api/system/ping with ETag header.');
      } else {
        log(`INFO: ${result.message || 'Payload transmitted (server may be offline).'}`);
      }
    } catch (err) {
      log(`FATAL ERROR: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const fetchDrops = async () => {
    setIsFetching(true);
    try {
      const res = await fetch('/api/covert-drops');
      const data = await res.json();
      if (data.success) {
        setDrops(data.drops);
      } else {
        alert(`Failed to sync drops: ${data.message}\n\nStack: ${data.stack || 'N/A'}`);
      }
    } catch (err) {
      console.error(err);
      alert(`Network Error: ${err.message}`);
    } finally {
      setIsFetching(false);
    }
  };

  const handleDecryptDrop = async (url) => {
    try {
      const urlObj = new URL(url);
      const keyB64 = urlObj.searchParams.get('k');
      const ivB64  = urlObj.searchParams.get('iv');
      const ctB64  = urlObj.searchParams.get('d');
      if (keyB64 && ivB64 && ctB64) {
        const plain = await decryptAES(keyB64, ivB64, ctB64);
        setDecryptedData(prev => ({ ...prev, [url]: plain }));
      } else {
        setDecryptedData(prev => ({ ...prev, [url]: url }));
      }
    } catch (err) {
      console.error('Failed to decrypt drop', err);
      setDecryptedData(prev => ({ ...prev, [url]: 'Decryption failed: ' + err.message }));
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Stealth Operations Console (PEC v2)</h1>
      <p style={styles.subtitle}>Demonstration of Zero-Knowledge TPM Key Exchange & Polymorphic ETag Cloaking</p>

      <div style={styles.tabs}>
        <button 
          style={activeTab === 'sender' ? styles.activeTabBtn : styles.tabBtn} 
          onClick={() => setActiveTab('sender')}>
          Client 1: Infiltration (Sender)
        </button>
        <button 
          style={activeTab === 'receiver' ? styles.activeTabBtn : styles.tabBtn} 
          onClick={() => setActiveTab('receiver')}>
          Client 2: Extraction (Receiver)
        </button>
      </div>

      <div style={styles.panel}>
        {activeTab === 'sender' && (
          <div>
            <h3>Covert Data Exfiltration</h3>
            <p style={{color: '#888', fontSize: '0.9rem', marginBottom: '15px'}}>
              Enter the highly sensitive data below. The system will encrypt it, upload it to an S3 Dead Drop, and covertly exfiltrate the S3 URL using morphed HTTP ETags and Timing Delays.
            </p>
            <textarea
              style={styles.textarea}
              placeholder="Enter top-secret data (e.g. passwords, certificates, intel)..."
              value={secretText}
              onChange={(e) => setSecretText(e.target.value)}
            />
            <button 
              style={styles.exfiltrateBtn} 
              onClick={handleExfiltrate} 
              disabled={isSending || !secretText}
            >
              {isSending ? 'Exfiltrating...' : 'Upload & Exfiltrate Covertly'}
            </button>

            <div style={styles.terminal}>
              <div style={{color: '#0f0', marginBottom: '10px'}}>--- STEALTH EXFILTRATION LOGS ---</div>
              {statusLogs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
              {statusLogs.length > 0 && <div style={{marginTop: '10px', color: '#ffcc00'}}>Open Network Tab (F12) to inspect the morphed ETag requests!</div>}
            </div>
          </div>
        )}

        {activeTab === 'receiver' && (
          <div>
            <h3>Dead Drop Extraction</h3>
            <button style={styles.syncBtn} onClick={fetchDrops} disabled={isFetching}>
              {isFetching ? 'Scanning for Signals...' : 'Sync Covert Drops'}
            </button>

            <div style={{marginTop: '20px'}}>
              {drops.length === 0 ? (
                <p style={{color: '#666'}}>No drops intercepted yet.</p>
              ) : (
                drops.map((drop) => (
                  <div key={drop.id} style={styles.dropCard}>
                    <div style={styles.dropMeta}>
                      <span>Drop ID: {drop.id.substring(0,8)}</span>
                      <span>Timing Bits: {drop.temporal_bits || 'N/A'}</span>
                      <span>Intercepted: {new Date(drop.createdAt).toLocaleString()}</span>
                    </div>
                    <div style={styles.dropUrl}>{drop.s3_url}</div>
                    
                    {decryptedData[drop.s3_url] ? (
                      <div style={styles.decryptedBox}>
                        <strong>Decrypted Payload:</strong><br/>
                        {decryptedData[drop.s3_url]}
                      </div>
                    ) : (
                      <button style={styles.decryptBtn} onClick={() => handleDecryptDrop(drop.s3_url)}>
                        Download & Decrypt Blob
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '30px', maxWidth: '900px', margin: '0 auto', color: '#e0e0e0', fontFamily: 'Inter, sans-serif' },
  title: { fontSize: '2rem', color: '#00ffcc', textShadow: '0 0 10px rgba(0,255,204,0.3)', marginBottom: '5px' },
  subtitle: { color: '#888', marginBottom: '30px' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '20px' },
  tabBtn: { padding: '10px 20px', background: '#222', border: '1px solid #444', color: '#aaa', cursor: 'pointer', borderRadius: '4px' },
  activeTabBtn: { padding: '10px 20px', background: '#00ffcc', border: '1px solid #00ffcc', color: '#000', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' },
  panel: { background: '#111', padding: '25px', borderRadius: '8px', border: '1px solid #333' },
  textarea: { width: '100%', height: '120px', background: '#000', color: '#0f0', border: '1px solid #333', padding: '10px', fontFamily: 'monospace', marginBottom: '15px' },
  exfiltrateBtn: { background: '#ff3366', color: '#fff', border: 'none', padding: '12px 24px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', width: '100%' },
  syncBtn: { background: '#3366ff', color: '#fff', border: 'none', padding: '12px 24px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' },
  terminal: { background: '#0a0a0a', border: '1px solid #222', padding: '15px', marginTop: '20px', fontFamily: 'monospace', color: '#0f0', minHeight: '100px', borderRadius: '4px' },
  dropCard: { background: '#1a1a1a', border: '1px solid #333', padding: '15px', borderRadius: '4px', marginBottom: '15px' },
  dropMeta: { display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888', marginBottom: '10px' },
  dropUrl: { background: '#000', padding: '8px', color: '#00ffcc', fontFamily: 'monospace', wordBreak: 'break-all', fontSize: '0.9rem', marginBottom: '10px' },
  decryptBtn: { background: '#00cc66', color: '#000', border: 'none', padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', fontSize: '0.9rem' },
  decryptedBox: { background: '#002200', border: '1px solid #00ff00', padding: '10px', color: '#00ff00', fontFamily: 'monospace' }
};

export default StealthConsole;
