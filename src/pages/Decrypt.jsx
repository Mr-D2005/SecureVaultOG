import React, { useState } from 'react';
import { Unlock, Key, Copy, CheckCircle2, ArrowRightLeft } from 'lucide-react';

const Decrypt = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [decrypting, setDecrypting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDecrypt = () => {
    if (!inputText) return;
    setDecrypting(true);
    setTimeout(() => {
      setOutputText('The quick brown fox jumps over the lazy dog. Mission coordinates confirmed.');
      setDecrypting(false);
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
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Decrypt Payload</h1>
        <p className="text-dim">Decrypt your ciphertext messages using AES-256 and AWS KMS key management.</p>
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

      {/* Decryption Form */}
      <div className="card">
        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
          <label>Encrypted Ciphertext</label>
          <textarea
            className="input-control"
            rows={5}
            placeholder="Paste your ciphertext here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ resize: 'vertical', fontFamily: 'monospace', borderRadius: 'var(--radius-md)', borderBottom: 'none', border: '1px solid var(--color-outline-variant)' }}
          ></textarea>
        </div>

        <button className="btn" onClick={handleDecrypt} disabled={decrypting || !inputText} style={{ width: '100%', marginBottom: '2rem', padding: '0.9rem' }}>
          {decrypting ? 'Decrypting Payload...' : 'Extract & Decrypt'} {!decrypting && <ArrowRightLeft size={16} />}
        </button>

        {outputText && (
          <div className="input-group" style={{ animation: 'fadeIn 0.5s ease' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Decrypted Output
              <button
                onClick={copyToClipboard}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontFamily: 'var(--font-main)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}
              >
                {copied ? <><CheckCircle2 size={14} /> Copied!</> : <><Copy size={14} /> Copy Plaintext</>}
              </button>
            </label>
            <div style={{
              background: 'var(--color-surface-container-lowest)',
              border: '1px solid rgba(57, 255, 20, 0.15)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              fontFamily: 'monospace', fontSize: '0.9375rem',
              color: 'var(--color-primary)',
              lineHeight: 1.6,
              minHeight: '100px',
            }}>
              <span style={{ color: 'var(--color-text-dim)' }}>&gt; </span>{outputText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Decrypt;
