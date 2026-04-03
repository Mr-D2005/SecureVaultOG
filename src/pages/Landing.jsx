import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Image, Cpu, Cloud, Lock, Unlock, ArrowRight, Fingerprint, Database, Eye, ChevronRight, Zap } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

const Landing = () => {
  const features = [
    { icon: <Lock size={28} />, title: 'AES Encryption (KMS)', desc: 'Military-grade 256-bit AES encryption governed by a distributed Key Management System for absolute control.' },
    { icon: <Unlock size={28} />, title: 'Secure Decryption System', desc: 'Our proprietary protocol allows for ephemeral decryption within memory-isolated containers.' },
    { icon: <Image size={28} />, title: 'Image Steganography', desc: 'Hide critical data within visual assets using bit-level manipulation. A secure way to transmit information.' },
    { icon: <Cloud size={28} />, title: 'Cloud Storage (S3)', desc: 'Redundant, globally distributed S3-compatible buckets. Your encrypted payloads are fragmented across regions.' },
    { icon: <Fingerprint size={28} />, title: 'User Authentication', desc: 'Multi-factor biometric synthesis and hardware-backed identity verification with Zero-Trust handshake.' },
    { icon: <Cpu size={28} />, title: 'AI Detection', desc: 'Neural networks monitoring access patterns in real-time. Detecting anomalies before they become breaches.' },
  ];

  const lifecycle = [
    { phase: '01', title: 'Biometric Admission', desc: 'Identity verification utilizing multi-factor obsidian protocols. Your session begins in a hardened execution environment.' },
    { phase: '02', title: 'KMS + AES Encryption', desc: 'Data is shattered into AES-256 fragments. Keys are managed via decentralized KMS, ensuring even we cannot peer into your vault.' },
    { phase: '03', title: 'Steganographic Hiding', desc: 'Encrypted payloads are woven into the digital noise of carrier files. Obfuscation makes the data invisible to traditional scanners.' },
    { phase: '04', title: 'Global S3 Immutable Storage', desc: 'Dispersed across multiple geographic zones on hardened S3 buckets with Object Lock enabled. Data is permanent and indestructible.' },
    { phase: '05', title: 'AI Threat Detection', desc: 'Our proprietary AI sentinels monitor access patterns in real-time. Any anomalous behavior triggers an immediate vault lockdown.' },
    { phase: '06', title: 'Seamless Restoration', desc: 'Authorized requests instantly re-assemble and decrypt your data. The kinetic cycle completes, returning your data to human-readable form.' },
  ];

  return (
    <div className="bg-grid" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)', position: 'relative' }}>
      
      {/* Particle Background Hero (Globally fixed from within component) */}
      <ParticleBackground color="#39FF14" particleCount={100} />


      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.25rem 5%',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(11, 19, 38, 0.8)',
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '1px solid var(--color-outline)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-cyan), var(--color-primary))',
            width: '32px', height: '32px', borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 15px var(--color-primary-glow)',
          }}>
            <Lock size={16} color="#000" />
          </div>
          <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            <span className="text-neon">Secure</span>Vault
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          {['Platform', 'Features', 'Solutions', 'Developers', 'Pricing'].map(item => (
            <span key={item} style={{
              color: item === 'Features' ? 'var(--color-text)' : 'var(--color-text-dim)',
              fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
              textDecoration: item === 'Features' ? 'underline' : 'none',
              textUnderlineOffset: '4px',
              transition: 'color 0.2s',
            }} onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.target.style.color = item === 'Features' ? 'var(--color-text)' : 'var(--color-text-dim)'}>{item}</span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/login" style={{ color: 'var(--color-text)', fontWeight: 500, fontSize: '0.9375rem' }}>Login</Link>
          <Link to="/register" className="btn" style={{ 
            padding: '0.6rem 1.5rem', 
            fontSize: '0.8125rem',
            background: 'linear-gradient(135deg, var(--color-cyan) 0%, var(--color-primary) 100%)',
            color: '#000'
          }}>Start Secure</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '8rem 5% 7rem',
        position: 'relative', overflow: 'hidden',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Ambient Fog Hero */}
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '600px', background: 'radial-gradient(circle, var(--color-cyan-glow) 0%, transparent 70%)', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%', zIndex: 0, animation: 'glowPulse 10s ease-in-out infinite' }}></div>

        <div style={{ maxWidth: '900px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(57, 255, 20, 0.05)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(57, 255, 20, 0.15)', marginBottom: '2rem' }}>
            <Zap size={14} className="text-neon" />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-primary)' }}>Quantum-Resistant Infrastructure</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '5rem', fontWeight: 800,
            lineHeight: 1, marginBottom: '2rem', letterSpacing: '-0.04em',
          }}>
            Hardened Security<br/>
            <span className="text-neon" style={{ textShadow: '0 0 30px var(--color-primary-glow)' }}>Engineered for Trust.</span>
          </h1>

          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-dim)', maxWidth: '640px', marginBottom: '3rem', lineHeight: 1.6, margin: '0 auto 3rem' }}>
            SecureVault is a high-fidelity data preservation environment. We leverage zero-knowledge encryption and AI-driven threat mitigation to ensure your data remains imperceptible.
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
            <Link to="/register" className="btn" style={{ 
              padding: '1rem 2.5rem', 
              fontSize: '0.9375rem',
              background: 'linear-gradient(135deg, var(--color-cyan) 0%, var(--color-primary) 100%)',
              color: '#000'
            }}>
              Deploy Your Vault <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '0.9375rem' }}>
              Speak to Security Architect
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '4rem', marginTop: '5rem', justifyContent: 'center', opacity: 0.6 }}>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>99.9%</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Uptime SLA</p>
            </div>
            <div style={{ width: '1px', background: 'var(--color-outline)' }}></div>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>AES-256</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Encryption</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '8rem 5%', background: 'var(--color-surface-dim)', borderTop: '1px solid var(--color-outline)', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800,
            marginBottom: '1rem', letterSpacing: '-0.02em',
          }}>
            Architected for <span className="text-neon">Total Immutability.</span>
          </h2>
          <p style={{ color: 'var(--color-text-dim)', maxWidth: '540px', margin: '0 auto', lineHeight: 1.7 }}>
            Experience the next evolution of digital defense. SecureVault combines kinetic encryption cycles with AI-driven threat mitigation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{
              padding: '2.5rem',
              display: 'flex', flexDirection: 'column', gap: '1.25rem',
              border: '1px solid rgba(57, 255, 20, 0.05)',
            }}>
              <div style={{
                background: 'var(--color-primary-dim)', width: '52px', height: '52px',
                borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-primary)',
              }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{f.title}</h3>
              <p style={{ color: 'var(--color-text-dim)', margin: 0, fontSize: '0.9375rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lifecycle */}
      <section style={{ padding: '8rem 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
            The Secure <span className="text-neon">Lifecycle</span>
          </h2>
          <p style={{ color: 'var(--color-text-dim)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7, fontSize: '1.125rem' }}>
            Experience the kinetic journey of your data as it moves through our multi-layered obsidian vault.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4rem 2.5rem', maxWidth: '1100px', margin: '0 auto' }}>
          {lifecycle.map((step, i) => (
            <div key={i} style={{ position: 'relative' }}>
               <div style={{
                fontSize: '4rem', fontWeight: 900, fontFamily: 'var(--font-display)',
                color: 'var(--color-primary)', opacity: 0.1, position: 'absolute',
                top: '-2rem', left: '-1rem', zIndex: 0
              }}>{step.phase}</div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-text)' }}>{step.title}</h3>
                <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>{step.desc} <ChevronRight size={14} className="text-neon" style={{ display: 'inline', marginLeft: '4px' }} /></p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '4rem 5% 2rem',
        borderTop: '1px solid var(--color-outline)',
        background: 'var(--color-surface-dim)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 2fr', gap: '4rem', marginBottom: '4rem' }}>
           <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>
              <span className="text-neon">Secure</span>Vault
            </h3>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9375rem', lineHeight: 1.6, maxWidth: '280px' }}>
              Precision-engineered security for the modern digital era. Developed by the Google Deepmind team for Advanced Agentic Coding.
            </p>
          </div>
          {[
            { title: 'Resources', items: ['Security Whitepaper', 'Documentation', 'System Status', 'Help Center'] },
            { title: 'Company', items: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security Policy'] },
          ].map((col, i) => (
            <div key={i}>
              <h4 style={{ color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.5rem' }}>{col.title}</h4>
              {col.items.map(item => (
                <p key={item} style={{ color: 'var(--color-text-dim)', fontSize: '0.875rem', marginBottom: '0.75rem', cursor: 'pointer' }}>{item}</p>
              ))}
            </div>
          ))}
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Join the Network</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="email" className="input-control" placeholder="Email" style={{ fontSize: '0.875rem', padding: '0.75rem 1rem' }} />
              <button className="btn" style={{ padding: '0.75rem 1.25rem', background: 'var(--color-primary)', color: '#000' }}><ArrowRight size={20} /></button>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingTop: '2.5rem', borderTop: '1px solid var(--color-outline)' }}>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', opacity: 0.6 }}>
            <Shield size={16} className="text-neon" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>ENCRYPTED PROTOCOL ACTIVE</span>
          </div>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.8125rem', letterSpacing: '0.05em' }}>
            &copy; 2024 SecureVault Central Intelligence. All systems operating within designated parameters.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
