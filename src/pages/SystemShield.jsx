import React from 'react';
import { ShieldCheck, Download, Cpu, ShieldAlert, Lock, Zap, Globe, BrainCircuit } from 'lucide-react';

const SystemShield = () => {
  const downloadSoftware = () => {
    window.location.href = '/api/system-shield/download';
  };

  return (
    <div style={{ 
      minHeight: '100%', 
      backgroundColor: '#0a0a1a', 
      color: '#fff', 
      fontFamily: '"Inter", sans-serif',
      borderRadius: '20px',
      overflow: 'hidden',
      border: '1px solid rgba(0, 220, 156, 0.2)'
    }}>
      {/* Hero Section */}
      <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'radial-gradient(circle at top, rgba(0,220,156,0.1) 0%, #0a0a1a 70%)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ background: '#00dc9c', padding: '15px', borderRadius: '15px', boxShadow: '0 0 30px rgba(0, 220, 156, 0.4)' }}>
            <ShieldCheck size={48} color="#0a0a1a" />
          </div>
        </div>
        
        <span style={{ color: '#00dc9c', fontWeight: 800, letterSpacing: '2px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
          Total AI Protection
        </span>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, margin: '1rem 0', letterSpacing: '-1px' }}>
          SecureVault <span style={{ color: '#00dc9c' }}>Antivirus</span>
        </h1>
        <p style={{ color: '#888', maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Download the world's first local security suite powered entirely by autonomous AI agents. 
          Expert neural agents handle behavioral scanning, firewall blocking, and identity isolation.
        </p>

        <button 
          onClick={downloadSoftware}
          style={{ 
            background: '#00dc9c', color: '#0a0a1a', border: 'none', 
            padding: '1rem 3rem', borderRadius: '12px', fontWeight: 900, fontSize: '1.1rem',
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
            boxShadow: '0 10px 25px rgba(0, 220, 156, 0.3)', transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Download size={20} />
          Download Windows Software
        </button>
      </div>

      {/* Feature Grid */}
      <div style={{ padding: '2rem 3rem 4rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {[
          { icon: Cpu, name: 'AGENT_DNA (Antivirus)', desc: 'Heuristic pattern scanner that monitors active process memory and neutralizes zero-day malware.' },
          { icon: ShieldAlert, name: 'AGENT_NET (Firewall)', desc: 'AI NetGuard firewall that audits open network sockets, filters packets, and stops intrusion.' },
          { icon: Lock, name: 'AGENT_VAULT (Locker)', desc: 'Secure credential locker sandbox that isolates files, encrypts passwords, and guards clipboard integrity.' },
          { icon: Zap, name: 'AGENT_PURGE (Booster)', desc: 'QuickClean speed optimizer that clears local tracking caches, sweeps system temp files, and boots CPU execution.' },
          { icon: Globe, name: 'AGENT_PHISH (WebShield)', desc: 'Safe Browsing defender that audits browser Cache, blocks phishing hooks, and blacklists malicious domains.' },
          { icon: BrainCircuit, name: 'AGENT_STEALTH (VPN)', desc: 'Obfuscated VPN proxy agent that scrambles physical MAC addresses and routes traffic through secure crypt tunnels.' }
        ].map((feat, i) => (
          <div key={i} style={{ 
            background: '#15152a', padding: '1.5rem', borderRadius: '15px', 
            border: '1px solid rgba(0, 220, 156, 0.1)',
            transition: 'all 0.3s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(0, 220, 156, 0.08)', padding: '10px', borderRadius: '10px' }}>
                <feat.icon size={20} color="#00dc9c" />
              </div>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>{feat.name}</h3>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: '0.85rem', lineHeight: 1.5 }}>{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemShield;
