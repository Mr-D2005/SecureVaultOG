import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { GlowCardGrid } from '../components/ui/GlowCardGrid';
import { AntigravityElement } from '../components/ui/AntigravityElement';
import './Features.css';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: '🔐', title: 'AES-256 Encryption',
    desc: 'Military-grade AES-256-CBC encryption with unique per-message keys. Every payload is sealed with an independent cryptographic envelope — zero knowledge, zero exposure.',
    stats: [{ label: 'Key Length', value: '256-bit' }, { label: 'Mode', value: 'CBC + HMAC' }],
  },
  {
    icon: '🖼️', title: 'LSB Steganography',
    desc: 'Embeds encrypted ciphertext into the Least Significant Bits of carrier images. Pixel-perfect concealment makes your data invisible to the naked eye and to automated scanners.',
    stats: [{ label: 'Bit Depth', value: '1-bit LSB' }, { label: 'Capacity', value: '~12 KB/MP' }],
  },
  {
    icon: '🤖', title: 'AI Steganalysis',
    desc: 'TensorFlow-powered neural network analyses incoming images for hidden data fingerprints. Shannon entropy scoring and spectral variance detect anomalies in real time.',
    stats: [{ label: 'Accuracy', value: '99.2%' }, { label: 'Latency', value: '<50ms' }],
  },
  {
    icon: '🗝️', title: 'AWS KMS Integration',
    desc: 'Hardware Security Module-backed key management through AWS Key Management Service. Your master keys never leave the HSM — envelope encryption at its finest.',
    stats: [{ label: 'HSM Level', value: 'FIPS 140-2 L3' }, { label: 'Key Rotation', value: 'Automatic' }],
  },
  {
    icon: '🛡️', title: 'Threat Intelligence',
    desc: 'Real-time adversarial URL scanning powered by Sentinel AI. Deep forensic analysis scores threat risk, detects phishing infrastructure, and deploys TCP tarpits to neutralise attackers.',
    stats: [{ label: 'Engine', value: 'Sentinel AI v4' }, { label: 'Response', value: 'Real-time' }],
  },
  {
    icon: '🧠', title: 'Ravan AI Assistant',
    desc: 'Voice-enabled neural interface that orchestrates every SecureVault operation. Encrypt, decrypt, hide, detect, and scan threats — all through natural language or voice commands.',
    stats: [{ label: 'Interface', value: 'Voice + Text' }, { label: 'Backend', value: 'Groq LLM' }],
  },
  {
    icon: '📡', title: 'Secure Cloud Pipeline',
    desc: 'End-to-end encrypted image pipeline from client to S3 storage. TLS 1.3 in transit, AES-256 at rest. Presigned URLs ensure time-limited, authenticated access.',
    stats: [{ label: 'Transport', value: 'TLS 1.3' }, { label: 'Storage', value: 'S3 SSE' }],
  },
  {
    icon: '⚡', title: 'TCP Tarpit Deployment',
    desc: 'When a phishing threat is detected, deploy an active TCP tarpit to drain the attacker\'s server resources. Offensive counter-intelligence at the click of a button.',
    stats: [{ label: 'Protocol', value: 'TCP Slow-Drain' }, { label: 'Status', value: 'Live Monitor' }],
  },
];

const useCases = [
  { icon: '🏢', title: 'Enterprise Communication', desc: 'Secure internal memos and IP transfers between offices with invisible steganographic channels.' },
  { icon: '📰', title: 'Journalism & Whistleblowing', desc: 'Protect source identities by embedding sensitive documents inside innocuous photographs.' },
  { icon: '⚖️', title: 'Legal & Compliance', desc: 'Transmit privileged attorney-client communications with military-grade undetectability.' },
  { icon: '🏥', title: 'Healthcare (HIPAA)', desc: 'Share patient records between facilities without exposing PHI to network interception.' },
];

const Features = () => {
  const navigate = useNavigate();
  const pageRef = useRef(null);

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.feat-card-anim', {
        scrollTrigger: { trigger: '.feat-grid', start: 'top 85%' },
        y: 80, scale: 0.9, opacity: 0, duration: 1, stagger: 0.12, ease: 'expo.out',
      });
      gsap.from('.feat-usecase-card', {
        scrollTrigger: { trigger: '.feat-usecases', start: 'top 85%' },
        y: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="feat-page" ref={pageRef}>
      {/* ── Navbar ── */}
      <nav className="feat-nav">
        <span className="feat-nav-logo" onClick={() => navigate('/')}>SECUREVAULT</span>
        <div className="feat-nav-links">
          <a href="#/features" className="feat-nav-link active">Features</a>
          <a href="#/security" className="feat-nav-link">Security</a>
          <a href="#/how-it-works" className="feat-nav-link">How It Works</a>
          <a href="#/docs" className="feat-nav-link">Docs</a>
        </div>
        <div className="feat-nav-cta">
          <button className="feat-btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
          <button className="feat-btn-solid" onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="feat-hero">
        <div className="feat-hero-bg-text">FEATURES</div>
        <span className="feat-badge">⚡ PLATFORM CAPABILITIES</span>
        <h1 className="feat-hero-title">
          Everything You Need to<br /><span className="lp-gradient-text">Communicate Securely</span>
        </h1>
        <p className="feat-hero-sub">
          A unified platform combining steganography, AI-driven threat detection, military-grade encryption,
          and an intelligent AI assistant — powered by enterprise cloud infrastructure.
        </p>
      </header>

      {/* ── Feature Cards ── */}
      <section className="feat-section">
        <GlowCardGrid columns={3} className="feat-grid">
          {features.map((f) => (
            <AntigravityElement key={f.title} strength={20} radius={180} style={{ display: 'block', height: '100%' }}>
              <SpotlightCard glowColor="purple" size="lg" className="feat-card-anim" style={{ height: '100%', padding: '2rem', boxSizing: 'border-box' }}>
                <div className="feat-card-icon">{f.icon}</div>
                <h3 className="feat-card-title">{f.title}</h3>
                <p className="feat-card-desc">{f.desc}</p>
                <div className="feat-card-stats">
                  {f.stats.map(s => (
                    <div key={s.label} className="feat-stat-chip">
                      <span className="feat-stat-label">{s.label}</span>
                      <span className="feat-stat-value">{s.value}</span>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </AntigravityElement>
          ))}
        </GlowCardGrid>
      </section>

      {/* ── Use Cases ── */}
      <section className="feat-section feat-usecases">
        <span className="feat-badge">🎯 USE CASES</span>
        <h2 className="feat-section-title">Built for <span className="lp-gradient-text">Real-World Scenarios</span></h2>
        <div className="feat-usecase-grid">
          {useCases.map(u => (
            <div key={u.title} className="feat-usecase-card">
              <span className="feat-usecase-icon">{u.icon}</span>
              <h4>{u.title}</h4>
              <p>{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="feat-cta">
        <h2>Ready to <span className="lp-gradient-text">Get Started?</span></h2>
        <p>Create your free account and start protecting your communications today.</p>
        <button className="feat-btn-solid feat-btn-lg" onClick={() => navigate('/register')}>Create Free Account</button>
      </section>

      <footer className="feat-footer">
        <span>© {new Date().getFullYear()} SECUREVAULT ENGINE. ALL RIGHTS RESERVED.</span>
      </footer>
    </div>
  );
};

export default Features;
