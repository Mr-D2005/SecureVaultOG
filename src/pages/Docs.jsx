import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import './Features.css';

const sections = [
  {
    id: 'getting-started', title: '🚀 Getting Started', items: [
      { q: 'What is SecureVault?', a: 'SecureVault is an AI-powered platform combining military-grade AES-256 encryption, LSB steganography, threat intelligence, and a neural AI assistant (Ravan) to enable completely invisible, secure communication.' },
      { q: 'How do I create an account?', a: 'Click "Get Started" on the landing page, fill in your name, email, and password, then verify your email via the OTP sent to your inbox. Your AWS KMS master key is provisioned automatically.' },
      { q: 'What do I need to get started?', a: 'Just a modern web browser. SecureVault runs entirely in the browser with cloud backend support. No software installation required.' },
    ]
  },
  {
    id: 'encryption', title: '🔐 Encryption & Decryption', items: [
      { q: 'How does encryption work?', a: 'Files and messages are encrypted using AES-256-CBC with a unique random key and IV per operation. The data key is then envelope-encrypted by your AWS KMS master key. The result is a .PEM key file you download — this is your only way to decrypt.' },
      { q: 'How do I decrypt a file?', a: 'Navigate to the Decrypt page or tell Ravan "decrypt this". Upload your .PEM key file and the system automatically unwraps the KMS-sealed data key, decrypts the ciphertext, and reconstitutes your original file.' },
      { q: 'What is the .PEM key file?', a: 'It\'s a SecureVault Master Link Key containing your sealed AES key, IV, S3 reference, and asset metadata. Without this file, decryption is mathematically impossible. Store it securely.' },
    ]
  },
  {
    id: 'steganography', title: '🖼️ Steganography', items: [
      { q: 'What is steganography?', a: 'Steganography is the practice of hiding information within non-secret carriers — like embedding a text message inside an image\'s pixel data, invisible to the naked eye.' },
      { q: 'How does SecureVault hide data?', a: 'We use optimised LSB (Least Significant Bit) insertion with randomised pixel selection. Your encrypted payload is distributed across the carrier image\'s colour channels at the sub-pixel level.' },
      { q: 'What carriers are supported?', a: 'Currently PNG and BMP images are supported as carrier formats. The payload can be text messages or files up to the carrier\'s embedding capacity (~12 KB per megapixel).' },
    ]
  },
  {
    id: 'detection', title: '🤖 AI Detection', items: [
      { q: 'How does steganalysis work?', a: 'Our TensorFlow-backed engine calculates Shannon entropy, neural variance, and chi-square statistics across image channels. Anomalous patterns indicate hidden data with 99.2% accuracy.' },
      { q: 'Can it detect non-SecureVault steganography?', a: 'Yes. The AI heuristics detect any LSB-based steganographic insertion, regardless of the tool that created it. Spectral analysis catches patterns invisible to human eyes.' },
      { q: 'What happens when hidden data is found?', a: 'If the carrier was created by SecureVault, the payload is automatically extracted and displayed. For third-party stego, an anomaly warning is shown with forensic details.' },
    ]
  },
  {
    id: 'threat-intel', title: '🛡️ Threat Intelligence', items: [
      { q: 'What is Sentinel Threat Intel?', a: 'An AI-powered URL forensic scanner that analyses domains for phishing indicators, suspicious DNS records, SSL anomalies, and known malicious infrastructure patterns.' },
      { q: 'What is a TCP Tarpit?', a: 'When a critical threat is detected, you can deploy a TCP tarpit — a countermeasure that establishes slow connections to the attacker\'s server, draining their resources and slowing their operations.' },
      { q: 'How does threat scoring work?', a: 'The Sentinel AI assigns a 0-100 risk score based on multiple factors: domain age, hosting provider reputation, SSL certificate validity, URL pattern analysis, and known-threat database correlation.' },
    ]
  },
  {
    id: 'ravan', title: '🧠 Ravan AI Assistant', items: [
      { q: 'What is Ravan?', a: 'Ravan is SecureVault\'s AI-powered neural interface. It understands natural language and voice commands to orchestrate all platform operations — encrypt, decrypt, hide, detect, scan threats, and navigate.' },
      { q: 'What commands does Ravan support?', a: '"Encrypt this document", "decrypt my file", "hide my message in this photo", "scan this URL for threats", "detect steganography in this image" — and many more natural language variations.' },
      { q: 'Does Ravan support voice?', a: 'Yes. Click the microphone icon in the Ravan chat panel to activate voice recognition. Ravan processes your spoken command and responds with both text and text-to-speech audio.' },
    ]
  },
  {
    id: 'api', title: '⚡ API Reference', items: [
      { q: 'Encrypt Endpoint', a: 'POST /api/encrypt/data — Body: { data: base64, type: "file"|"text", name: string }. Returns: { sealedUrl, sealedKey, iv, assetId }.' },
      { q: 'Decrypt Endpoint', a: 'POST /api/encrypt/unseal — Body: { sealedUrl, sealedKey, iv }. Returns: { decryptedData: base64 }.' },
      { q: 'Stego Inject', a: 'POST /api/stego/inject — Body: { carrierBase64, carrierMime, carrierName, payloadText?, payloadBase64?, payloadName? }. Returns: image/png blob.' },
      { q: 'Stego Extract', a: 'POST /api/stego/extract — Body: { carrierBase64, carrierName }. Returns: { stegoSource, type, data, name, aiAnalysis }.' },
      { q: 'Threat Scan', a: 'POST /api/threat/scan — Body: { url: string }. Returns: { riskScore, hostname, isSuspicious, logs[], threatReason }.' },
      { q: 'Ravan Chat', a: 'POST /api/ravan/chat — Body: { message: string, history: array }. Returns: { reply: string } with [ACTION:*] tags for protocol execution.' },
    ]
  },
];

const Docs = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('getting-started');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (sectionId, idx) => {
    const key = `${sectionId}-${idx}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="feat-page">
      <nav className="feat-nav">
        <span className="feat-nav-logo" onClick={() => navigate('/')}>SECUREVAULT</span>
        <div className="feat-nav-links">
          <a href="#/features" className="feat-nav-link">Features</a>
          <a href="#/security" className="feat-nav-link">Security</a>
          <a href="#/how-it-works" className="feat-nav-link">How It Works</a>
          <a href="#/docs" className="feat-nav-link active">Docs</a>
        </div>
        <div className="feat-nav-cta">
          <button className="feat-btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
          <button className="feat-btn-solid" onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      <header className="feat-hero" style={{ paddingBottom: '40px' }}>
        <div className="feat-hero-bg-text">DOCS</div>
        <span className="feat-badge">📖 DOCUMENTATION</span>
        <h1 className="feat-hero-title">SecureVault <span className="lp-gradient-text">Documentation</span></h1>
        <p className="feat-hero-sub">Everything you need to know about using SecureVault — from getting started to API reference.</p>
      </header>

      <section className="feat-section" style={{ maxWidth: '1100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '40px' }}>
          {/* Sidebar */}
          <div style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
            {sections.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '10px 16px', marginBottom: '4px', borderRadius: 'var(--radius-md)',
                background: activeSection === s.id ? 'rgba(124,58,237,0.15)' : 'transparent',
                border: activeSection === s.id ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                color: activeSection === s.id ? '#fff' : 'var(--color-text-dim)',
                fontSize: '13px', fontWeight: activeSection === s.id ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                {s.title}
              </button>
            ))}
          </div>

          {/* Content */}
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '24px' }}>{currentSection.title}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentSection.items.map((item, idx) => {
                const key = `${activeSection}-${idx}`;
                const isOpen = openItems[key];
                return (
                  <SpotlightCard key={key} glowColor="purple" style={{
                    padding: 0, cursor: 'pointer', overflow: 'hidden',
                    border: isOpen ? '1px solid rgba(124,58,237,0.3)' : '1px solid var(--color-outline)',
                  }}>
                    <div onClick={() => toggleItem(activeSection, idx)} style={{
                      padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>{item.q}</h4>
                      <span style={{ color: 'var(--color-primary)', fontSize: '18px', fontWeight: 700, transition: 'transform 0.2s', transform: isOpen ? 'rotate(45deg)' : 'none' }}>+</span>
                    </div>
                    {isOpen && (
                      <div style={{
                        padding: '0 24px 18px', fontSize: '14px', color: 'var(--color-text-dim)', lineHeight: 1.7,
                        borderTop: '1px solid var(--color-outline)', paddingTop: '14px',
                        fontFamily: activeSection === 'api' ? "'SF Mono', 'Fira Code', monospace" : 'inherit',
                      }}>
                        {item.a}
                      </div>
                    )}
                  </SpotlightCard>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="feat-cta">
        <h2>Need More <span className="lp-gradient-text">Help?</span></h2>
        <p>Join SecureVault and use Ravan AI to guide you through any operation.</p>
        <button className="feat-btn-solid feat-btn-lg" onClick={() => navigate('/register')}>Get Started Free</button>
      </section>

      <footer className="feat-footer">
        <span>© {new Date().getFullYear()} SECUREVAULT ENGINE. ALL RIGHTS RESERVED.</span>
      </footer>
    </div>
  );
};

export default Docs;
