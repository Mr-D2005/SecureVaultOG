import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { AntigravityElement } from '../components/ui/AntigravityElement';
import './Security.css';

gsap.registerPlugin(ScrollTrigger);

const layers = [
  { icon: '🔐', title: 'AES-256-CBC Encryption', tag: 'LAYER 01 — DATA ENCRYPTION', color: '#7c3aed',
    desc: 'Every file and message is encrypted with a unique 256-bit key using the Advanced Encryption Standard in CBC mode with HMAC authentication.',
    details: ['Unique random key per operation', 'Random Initialisation Vector (IV)', 'HMAC-SHA256 integrity verification', 'NIST FIPS 197 compliant'],
    metric: '256-bit', metricLabel: 'KEY STRENGTH' },
  { icon: '🗝️', title: 'AWS KMS Envelope Encryption', tag: 'LAYER 02 — KEY MANAGEMENT', color: '#3b82f6',
    desc: 'Your AES data keys are themselves encrypted by a Customer Master Key stored in AWS KMS Hardware Security Modules.',
    details: ['FIPS 140-2 Level 3 HSMs', 'Automatic key rotation', 'Keys never leave the HSM', 'Envelope encryption pattern'],
    metric: 'FIPS L3', metricLabel: 'HSM GRADE' },
  { icon: '🖼️', title: 'LSB Steganographic Concealment', tag: 'LAYER 03 — DATA CONCEALMENT', color: '#a855f7',
    desc: 'Encrypted payloads are embedded into carrier images using optimised Least Significant Bit insertion with randomised pixel selection.',
    details: ['Randomised pixel distribution', 'Sub-pixel colour channel embedding', 'Statistically undetectable insertion', '~12 KB capacity per megapixel'],
    metric: '1-bit', metricLabel: 'BIT DEPTH' },
  { icon: '🤖', title: 'AI-Powered Steganalysis', tag: 'LAYER 04 — THREAT DETECTION', color: '#10b981',
    desc: 'Shannon entropy scoring and neural variance heuristics analyse every incoming image for hidden data fingerprints in real time.',
    details: ['Shannon entropy calculation', 'Chi-square statistical analysis', 'Neural variance heuristics', 'TensorFlow-backed inference engine'],
    metric: '99.2%', metricLabel: 'ACCURACY' },
  { icon: '🛡️', title: 'Sentinel Threat Intelligence', tag: 'LAYER 05 — ADVERSARIAL DEFENCE', color: '#f59e0b',
    desc: 'AI-powered URL forensic scanning detects phishing infrastructure, suspicious DNS records, SSL anomalies, and deploys TCP tarpits for active counter-intelligence.',
    details: ['Domain age & reputation scoring', 'SSL certificate validation', 'Phishing pattern detection', 'TCP tarpit counter-measures'],
    metric: 'LIVE', metricLabel: 'MONITORING' },
  { icon: '🧠', title: 'Ravan Neural Interface', tag: 'LAYER 06 — AI ORCHESTRATION', color: '#ec4899',
    desc: 'Voice-enabled AI assistant powered by Groq LLM orchestrates all security operations through natural language with action-tag protocol execution.',
    details: ['Natural language understanding', 'Voice recognition & TTS', 'Action-tag protocol routing', 'Context-aware multi-step workflows'],
    metric: 'VOICE', metricLabel: 'INTERFACE' },
];

const principles = [
  { title: 'Zero-Knowledge', desc: 'All encryption happens client-side. We physically cannot read your data. Only you hold decryption keys, stored in KMS under your control.', icon: '🔒', color: '#7c3aed' },
  { title: 'Zero-Trust', desc: 'Every request is authenticated independently with JWT tokens. No implicit trust between services. Short TTL with per-request validation.', icon: '🚫', color: '#ef4444' },
  { title: 'Defence in Depth', desc: 'Multiple independent security layers ensure that compromise of any single layer does not expose user data. Encryption + steganography + cloud isolation.', icon: '🏰', color: '#3b82f6' },
  { title: 'Minimal Surface', desc: 'Strict CSP, input sanitisation, parameterised queries, rate limiting on all endpoints. No client-side secret storage.', icon: '📐', color: '#10b981' },
];

const dataFlow = [
  { label: 'Your Message', icon: '✉️', color: '#ffffff' },
  { label: 'AES-256 Seal', icon: '🔐', color: '#7c3aed' },
  { label: 'KMS Key Wrap', icon: '🗝️', color: '#3b82f6' },
  { label: 'Stego Embed', icon: '🖼️', color: '#a855f7' },
  { label: 'S3 Upload', icon: '☁️', color: '#f59e0b' },
  { label: 'AI Verify', icon: '🤖', color: '#10b981' },
];

const Security = () => {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const [expandedLayer, setExpandedLayer] = useState(null);

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.sec-layer-row', {
        scrollTrigger: { trigger: '.sec-stack', start: 'top 80%' },
        x: -60, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
      });
      gsap.from('.sec-prin-card', {
        scrollTrigger: { trigger: '.sec-principles-grid', start: 'top 85%' },
        y: 50, scale: 0.95, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'expo.out',
      });
      gsap.from('.sec-flow-node', {
        scrollTrigger: { trigger: '.sec-flow', start: 'top 85%' },
        y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)',
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="sec-page" ref={pageRef}>
      {/* ── Navbar ── */}
      <nav className="sec-nav">
        <span className="sec-nav-logo" onClick={() => navigate('/')}>SECUREVAULT</span>
        <div className="sec-nav-links">
          <a href="#/features" className="sec-nav-link">Features</a>
          <a href="#/security" className="sec-nav-link active">Security</a>
          <a href="#/how-it-works" className="sec-nav-link">How It Works</a>
          <a href="#/docs" className="sec-nav-link">Docs</a>
        </div>
        <div className="sec-nav-cta">
          <button className="sec-btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
          <button className="sec-btn-solid" onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="sec-hero">
        <div className="sec-hero-bg-text">SECURITY</div>
        <div className="sec-hero-orb sec-hero-orb--1" />
        <div className="sec-hero-orb sec-hero-orb--2" />
        <div className="sec-hero-content">
          <span className="sec-badge">🔒 ZERO-TRUST ARCHITECTURE</span>
          <h1 className="sec-hero-title">
            Engineered for<br /><span className="sec-gradient-text">Paranoid-Level Privacy</span>
          </h1>
          <p className="sec-hero-sub">
            Six independent security layers protect your data. Even if one layer is compromised,
            your messages remain invisible and encrypted. We don't just secure — we make you undetectable.
          </p>
          <div className="sec-hero-stats">
            <div className="sec-hero-stat">
              <span className="sec-hero-stat-value">256-bit</span>
              <span className="sec-hero-stat-label">Encryption</span>
            </div>
            <div className="sec-hero-stat-divider" />
            <div className="sec-hero-stat">
              <span className="sec-hero-stat-value">6 Layers</span>
              <span className="sec-hero-stat-label">Defence Stack</span>
            </div>
            <div className="sec-hero-stat-divider" />
            <div className="sec-hero-stat">
              <span className="sec-hero-stat-value">99.2%</span>
              <span className="sec-hero-stat-label">AI Accuracy</span>
            </div>
            <div className="sec-hero-stat-divider" />
            <div className="sec-hero-stat">
              <span className="sec-hero-stat-value">0 Trust</span>
              <span className="sec-hero-stat-label">Architecture</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Security Stack ── */}
      <section className="sec-section sec-stack">
        <div className="sec-section-header">
          <span className="sec-badge">🏗️ SECURITY STACK</span>
          <h2 className="sec-section-title">Six Layers of <span className="sec-gradient-text">Impenetrable Defence</span></h2>
          <p className="sec-section-sub">Click any layer to explore its technical implementation in detail.</p>
        </div>

        <div className="sec-layers">
          {layers.map((l, i) => {
            const isExpanded = expandedLayer === i;
            return (
              <AntigravityElement key={l.title} strength={10} radius={250} style={{ display: 'block' }}>
                <div
                  className={`sec-layer-row ${isExpanded ? 'sec-layer-row--expanded' : ''}`}
                  onClick={() => setExpandedLayer(isExpanded ? null : i)}
                  style={{ '--layer-color': l.color }}
                >
                  <div className="sec-layer-left">
                    <div className="sec-layer-num">{String(i + 1).padStart(2, '0')}</div>
                    <div className="sec-layer-icon">{l.icon}</div>
                    <div className="sec-layer-info">
                      <span className="sec-layer-tag">{l.tag}</span>
                      <h3 className="sec-layer-title">{l.title}</h3>
                      <p className="sec-layer-desc">{l.desc}</p>
                    </div>
                  </div>
                  <div className="sec-layer-metric">
                    <span className="sec-layer-metric-value">{l.metric}</span>
                    <span className="sec-layer-metric-label">{l.metricLabel}</span>
                  </div>
                  <div className="sec-layer-expand-icon">{isExpanded ? '−' : '+'}</div>

                  {isExpanded && (
                    <div className="sec-layer-details">
                      {l.details.map(d => (
                        <div key={d} className="sec-layer-detail-item">
                          <span className="sec-layer-check" style={{ color: l.color }}>✓</span>
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AntigravityElement>
            );
          })}
        </div>
      </section>

      {/* ── Data Flow ── */}
      <section className="sec-section sec-flow-section">
        <div className="sec-section-header">
          <span className="sec-badge">📡 ENCRYPTION PIPELINE</span>
          <h2 className="sec-section-title">How Your Data <span className="sec-gradient-text">Travels Securely</span></h2>
        </div>
        <div className="sec-flow">
          {dataFlow.map((n, i) => (
            <React.Fragment key={n.label}>
              <div className="sec-flow-node" style={{ '--node-color': n.color }}>
                <div className="sec-flow-icon">{n.icon}</div>
                <span className="sec-flow-label">{n.label}</span>
                <div className="sec-flow-pulse" />
              </div>
              {i < dataFlow.length - 1 && (
                <div className="sec-flow-arrow">
                  <svg width="40" height="12" viewBox="0 0 40 12"><path d="M0 6h32l-5-5M32 6l-5 5" stroke="rgba(124,58,237,0.4)" strokeWidth="1.5" fill="none" /></svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── Core Principles ── */}
      <section className="sec-section">
        <div className="sec-section-header">
          <span className="sec-badge">⚙️ CORE PRINCIPLES</span>
          <h2 className="sec-section-title">Security by <span className="sec-gradient-text">Design</span></h2>
        </div>
        <div className="sec-principles-grid">
          {principles.map(p => (
            <SpotlightCard key={p.title} glowColor="purple" size="md" className="sec-prin-card" style={{ padding: '2rem', height: '100%', boxSizing: 'border-box' }}>
              <div className="sec-prin-icon-wrap" style={{ background: `${p.color}15`, borderColor: `${p.color}30` }}>
                <span style={{ fontSize: '28px' }}>{p.icon}</span>
              </div>
              <h4 className="sec-prin-title">{p.title}</h4>
              <p className="sec-prin-desc">{p.desc}</p>
              <div className="sec-prin-line" style={{ background: p.color }} />
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* ── Compliance ── */}
      <section className="sec-section sec-compliance">
        <div className="sec-section-header">
          <span className="sec-badge">✅ COMPLIANCE & STANDARDS</span>
          <h2 className="sec-section-title">Industry <span className="sec-gradient-text">Certifications</span></h2>
        </div>
        <div className="sec-certs-grid">
          {[
            { label: 'AES-256', detail: 'NIST FIPS 197', icon: '🔐' },
            { label: 'AWS KMS', detail: 'FIPS 140-2 L3', icon: '🗝️' },
            { label: 'TLS 1.3', detail: 'In-Transit', icon: '🔗' },
            { label: 'S3 SSE', detail: 'At-Rest', icon: '☁️' },
            { label: 'OWASP', detail: 'Top 10', icon: '🛡️' },
            { label: 'GDPR', detail: 'Compliant', icon: '📋' },
          ].map(c => (
            <div key={c.label} className="sec-cert-card">
              <span className="sec-cert-icon">{c.icon}</span>
              <span className="sec-cert-label">{c.label}</span>
              <span className="sec-cert-detail">{c.detail}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="sec-cta">
        <div className="sec-cta-glow sec-cta-glow--l" />
        <div className="sec-cta-glow sec-cta-glow--r" />
        <h2>Your Security is <span className="sec-gradient-text">Non-Negotiable</span></h2>
        <p>Join the platform that treats privacy as a fundamental right, not a feature.</p>
        <button className="sec-btn-solid sec-btn-lg" onClick={() => navigate('/register')}>Create Free Account</button>
      </section>

      <footer className="sec-footer">
        <span>© {new Date().getFullYear()} SECUREVAULT ENGINE. ALL RIGHTS RESERVED.</span>
      </footer>
    </div>
  );
};

export default Security;
