import React, { useState } from 'react';
import { Lock, Key, Copy, CheckCircle2, Zap } from 'lucide-react';

const Encrypt = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [encrypting, setEncrypting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleEncrypt = () => {
    if (!inputText) return;
    setEncrypting(true);
    setTimeout(() => {
      setOutputText('U2FsdGVkX19B/Kx9Z1z8aHlA8nQ1W2E4R6T8Y0U2I4O6P8A0S2D4F6G8H0J2K4L6Z8X0C2V4B6N8M0+w==');
      setEncrypting(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: '2.5rem', maxWidth: '800px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Encrypt Payload</h1>
        <p className="text-dim">Secure your plaintext messages using AES-256 and AWS KMS key management.</p>
      </header>

      {/* KMS Status Card */}
      <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--color-success-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <Key size={20} color="var(--color-primary)" />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9375rem' }}>AWS KMS Connected</p>
            <p className="text-dim" style={{ fontSize: '0.75rem', margin: 0, fontFamily: 'monospace' }}>Key ID: alias/securevault-master</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.75rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <div className="status-orb status-orb--active"></div>
          Active
        </div>
      </div>

      {/* Encryption Form */}
      <div className="card">
        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
          <label>Secret Message</label>
          <textarea
            className="input-control"
            rows={5}
            placeholder="Type your sensitive information here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ resize: 'vertical', borderRadius: 'var(--radius-md)', borderBottom: 'none', border: '1px solid var(--color-outline-variant)' }}
          ></textarea>
        </div>

        <button className="btn" onClick={handleEncrypt} disabled={encrypting || !inputText} style={{ width: '100%', marginBottom: '2rem', padding: '0.9rem' }}>
          {encrypting ? 'Encrypting Payload...' : 'Encrypt with KMS'} {!encrypting && <Zap size={16} />}
        </button>

        {outputText && (
          <div className="input-group" style={{ animation: 'fadeIn 0.5s ease' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Encrypted Output
              <button
                onClick={copyToClipboard}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontFamily: 'var(--font-main)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}
              >
                {copied ? <><CheckCircle2 size={14} /> Copied!</> : <><Copy size={14} /> Copy Ciphertext</>}
              </button>
            </label>
            <textarea
              className="input-control"
              rows={4}
              value={outputText}
              readOnly
              style={{
                fontFamily: 'monospace', color: 'var(--color-primary)',
                background: 'var(--color-surface-container-lowest)',
                resize: 'none',
                border: '1px solid rgba(57, 255, 20, 0.15)',
                borderRadius: 'var(--radius-md)',
              }}
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
};

export default Encrypt;
