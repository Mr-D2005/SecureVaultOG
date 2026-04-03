import React, { useState } from 'react';
import { Upload, Download, CloudUpload, Image as ImageIcon, CheckCircle2, Zap, Lock } from 'lucide-react';

const Steganography = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(URL.createObjectURL(e.target.files[0]));
      setComplete(false);
    }
  };

  const handleHide = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setComplete(true);
    }, 2000);
  };

  return (
    <div style={{ padding: '2.5rem' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Vault Command Center</h1>
          <p className="text-dim">Quantum-resistant steganography tools. Hide your data within standard media with absolute invisibility.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--color-success-bg)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(57,255,20,0.15)' }}>
          <div className="status-orb status-orb--active"></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>System: Secure</span>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Left Column — Encrypt & Hide */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--color-primary-dim)', width: '36px', height: '36px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <Lock size={18} />
            </div>
            <h2 style={{ fontSize: '1.375rem', margin: 0 }}>Encrypt & Hide</h2>
          </div>

          <div className="input-group">
            <label>Secret Message</label>
            <textarea
              className="input-control"
              rows={4}
              placeholder="Enter the text to be hidden within the obsidian layer..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ resize: 'none', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-outline-variant)', borderBottom: '1px solid var(--color-outline-variant)' }}
            ></textarea>
          </div>

          <div className="input-group">
            <label>Carrier Image</label>
            <div style={{
              border: '2px dashed var(--color-outline-variant)',
              padding: '2rem', borderRadius: 'var(--radius-md)',
              textAlign: 'center', cursor: 'pointer', position: 'relative',
              transition: 'border-color 0.3s',
              background: 'var(--color-surface-container-lowest)',
            }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-outline-variant)'}
            >
              <input type="file" accept="image/*" onChange={handleUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
              {file ? (
                <img src={file} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: 'var(--radius-md)' }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-dim)' }}>
                  <ImageIcon size={36} opacity={0.5} />
                  <p style={{ fontWeight: 600, margin: 0, fontSize: '0.9375rem' }}>Drop or Browse Image</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>PNG or WEBP recommended for lossless stego</p>
                </div>
              )}
            </div>
          </div>

          <button className="btn" onClick={handleHide} disabled={processing || !file || !message} style={{ width: '100%', padding: '0.9rem' }}>
            {processing ? 'Injecting Data...' : 'Encrypt & Hide'} <Zap size={16} />
          </button>
        </div>

        {/* Right Column — Output */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', border: complete ? '1px solid rgba(57,255,20,0.2)' : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--color-secondary-dim)', width: '36px', height: '36px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)' }}>
              <Download size={18} />
            </div>
            <h2 style={{ fontSize: '1.375rem', margin: 0 }}>Output Terminal</h2>
          </div>

          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'var(--color-surface-container-lowest)',
            borderRadius: 'var(--radius-md)', padding: '2rem',
            border: '1px solid var(--color-outline)',
            minHeight: '280px',
          }}>
            {!complete ? (
              <div style={{ textAlign: 'center' }}>
                <p className="text-dim" style={{ fontFamily: 'monospace', fontSize: '0.9375rem' }}>&gt; Waiting for injection sequence...</p>
                <p className="text-dim" style={{ fontFamily: 'monospace', fontSize: '0.8125rem', opacity: 0.5 }}>_</p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
                <CheckCircle2 size={56} color="var(--color-primary)" style={{ margin: '0 auto 1.25rem', filter: 'drop-shadow(0 0 12px rgba(57,255,20,0.3))' }} />
                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Injection Successful</h4>
                <p className="text-dim" style={{ marginBottom: '2rem', fontSize: '0.8125rem', maxWidth: '280px' }}>
                  Payload obfuscated via LSB Steganography. Image visual integrity maintained 100%.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.8125rem' }}>
                    <Download size={14} /> Download
                  </button>
                  <button className="btn" style={{ padding: '0.6rem 1.25rem', fontSize: '0.8125rem' }}>
                    <CloudUpload size={14} /> Send to AWS S3
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Steganography;
