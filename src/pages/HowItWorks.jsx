import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { AntigravityElement } from '../components/ui/AntigravityElement';
import './Features.css';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { number: '01', title: 'Create Your Vault', desc: 'Register and receive your unique encrypted key-pair via AWS KMS HSMs. Email verification secures your identity.', details: ['JWT + bcrypt auth', 'Email verification', 'KMS key provisioning'], icon: '🏗️', color: '#7c3aed' },
  { number: '02', title: 'Compose Your Payload', desc: 'Write a message or upload a file. Use the dashboard or tell Ravan AI — "encrypt this document".', details: ['Text or file payloads', 'Ravan AI voice/text', 'Drag-and-drop staging'], icon: '✍️', color: '#3b82f6' },
  { number: '03', title: 'Seal & Conceal', desc: 'AES-256 encrypts your data, KMS wraps the key, and LSB steganography hides the ciphertext in an image.', details: ['AES-256-CBC + random IV', 'KMS envelope wrapping', 'LSB steganographic embed'], icon: '🔐', color: '#a855f7' },
  { number: '04', title: 'Transmit Securely', desc: 'Share the carrier image or .PEM key file through any channel. Data is invisible and encrypted.', details: ['TLS 1.3 transport', 'Presigned URL with TTL', 'Channel-agnostic delivery'], icon: '📡', color: '#10b981' },
  { number: '05', title: 'Recipient Decodes', desc: 'Upload the .PEM key or carrier image — the AI extracts and decrypts automatically.', details: ['Auto PEM detection', 'AI stego extraction', 'File reconstitution'], icon: '🔓', color: '#f59e0b' },
  { number: '06', title: 'Threat Monitoring', desc: 'Run files through AI Steganalysis and URLs through Sentinel Threat Intel. Ravan alerts you to threats.', details: ['Shannon entropy analysis', 'URL forensic scan', 'TCP tarpit deployment'], icon: '🛡️', color: '#ef4444' },
];

const HowItWorks = () => {
  const navigate = useNavigate();
  const pageRef = useRef(null);

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.hiw-step', {
        scrollTrigger: { trigger: '.hiw-timeline', start: 'top 80%' },
        y: 80, opacity: 0, duration: 0.9, stagger: 0.2, ease: 'power3.out',
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="feat-page" ref={pageRef}>
      <nav className="feat-nav">
        <span className="feat-nav-logo" onClick={() => navigate('/')}>SECUREVAULT</span>
        <div className="feat-nav-links">
          <a href="#/features" className="feat-nav-link">Features</a>
          <a href="#/security" className="feat-nav-link">Security</a>
          <a href="#/how-it-works" className="feat-nav-link active">How It Works</a>
          <a href="#/docs" className="feat-nav-link">Docs</a>
        </div>
        <div className="feat-nav-cta">
          <button className="feat-btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
          <button className="feat-btn-solid" onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      <header className="feat-hero">
        <div className="feat-hero-bg-text">WORKFLOW</div>
        <span className="feat-badge">⚙️ OPERATIONAL WORKFLOW</span>
        <h1 className="feat-hero-title">How <span className="lp-gradient-text">SecureVault</span> Works</h1>
        <p className="feat-hero-sub">Six steps to hide, encrypt, transmit, and decode a message — completely invisible to the outside world.</p>
      </header>

      <section className="feat-section hiw-timeline">
        <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ position: 'absolute', left: '31px', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, var(--color-primary), var(--color-secondary), transparent)' }} />
          {steps.map((s) => (
            <AntigravityElement key={s.number} strength={12} radius={200} style={{ display: 'block' }}>
              <div className="hiw-step" style={{ display: 'flex', gap: '32px', marginBottom: '48px', position: 'relative', paddingLeft: '80px' }}>
                <div style={{ position: 'absolute', left: '12px', top: '8px', width: '40px', height: '40px', borderRadius: '50%', background: `${s.color}20`, border: `2px solid ${s.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: s.color, boxShadow: `0 0 20px ${s.color}30`, zIndex: 2 }}>
                  {s.number}
                </div>
                <SpotlightCard glowColor="purple" size="lg" style={{ padding: '2rem', width: '100%', boxSizing: 'border-box', borderLeft: `3px solid ${s.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '28px' }}>{s.icon}</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{s.title}</h3>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-dim)', lineHeight: 1.7, marginBottom: '16px' }}>{s.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {s.details.map(d => (
                      <span key={d} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '99px', background: `${s.color}15`, color: s.color, fontWeight: 600 }}>✓ {d}</span>
                    ))}
                  </div>
                </SpotlightCard>
              </div>
            </AntigravityElement>
          ))}
        </div>
      </section>

      <section className="feat-section" style={{ textAlign: 'center' }}>
        <span className="feat-badge">🏗️ ARCHITECTURE</span>
        <h2 className="feat-section-title">System <span className="lp-gradient-text">Data Flow</span></h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '40px' }}>
          {[
            { label: 'Browser', icon: '💻', color: '#fff' },
            { label: 'AES-256', icon: '🔐', color: '#7c3aed' },
            { label: 'Steganography', icon: '🖼️', color: '#a855f7' },
            { label: 'Python Core', icon: '🐍', color: '#3b82f6' },
            { label: 'Node Gateway', icon: '⚡', color: '#10b981' },
            { label: 'AWS S3+KMS', icon: '☁️', color: '#f59e0b' },
            { label: 'Ravan AI', icon: '🧠', color: '#ec4899' },
            { label: 'Sentinel', icon: '🛡️', color: '#ef4444' },
          ].map((n, i, arr) => (
            <React.Fragment key={n.label}>
              <div style={{ padding: '14px 20px', borderRadius: 'var(--radius-lg)', background: 'rgba(20,16,42,0.6)', border: `1px solid ${n.color}33`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>{n.icon}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: n.color }}>{n.label}</span>
              </div>
              {i < arr.length - 1 && i !== 3 && <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-on-surface-variant)' }}>→</div>}
              {i === 3 && <div style={{ width: '100%' }} />}
            </React.Fragment>
          ))}
        </div>
      </section>

      <section className="feat-cta">
        <h2>See It in <span className="lp-gradient-text">Action</span></h2>
        <p>Create your account and experience the full SecureVault pipeline.</p>
        <button className="feat-btn-solid feat-btn-lg" onClick={() => navigate('/register')}>Start Securing Now</button>
      </section>

      <footer className="feat-footer">
        <span>© {new Date().getFullYear()} SECUREVAULT ENGINE. ALL RIGHTS RESERVED.</span>
      </footer>
    </div>
  );
};

export default HowItWorks;
