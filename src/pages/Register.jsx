import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Key, User, Zap, Shield } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

const Register = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('register');

  return (
    <div className="bg-grid" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--color-bg)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Particle Background Component */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.6 }}>
        <ParticleBackground color="#39FF14" particleCount={50} />
      </div>

      {/* Layered Fog Effects */}
      <div style={{ 
        position: 'absolute', 
        width: '600px', 
        height: '600px', 
        background: 'radial-gradient(circle, var(--color-cyan-glow) 0%, transparent 70%)', 
        filter: 'blur(80px)', 
        borderRadius: '50%', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        zIndex: 0,
        animation: 'glowPulse 8s ease-in-out infinite'
      }}></div>

      <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative', zIndex: 10 }}>
        <h1 style={{ fontSize: '2.5rem', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
          Secure<span className="text-neon">Vault</span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: 0.8 }}>
          <Zap size={14} className="text-neon" />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Next-Gen Cybersecurity</span>
          <Zap size={14} className="text-neon" />
        </div>
      </div>

      {/* Register Card */}
      <div className="glass-panel-elevated" style={{ 
        width: '100%', 
        maxWidth: '420px', 
        padding: '2.5rem', 
        position: 'relative', 
        zIndex: 10,
        border: '1px solid rgba(0, 209, 255, 0.1)'
      }}>
        
        {/* Tab System */}
        <div className="auth-tabs">
          <div 
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('login');
              navigate('/login');
            }}
          >
            Login
          </div>
          <div 
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
          <div className="input-group">
            <label>Master Codename</label>
            <input 
              type="text" 
              className="input-control" 
              placeholder="operator_7" 
              style={{ background: 'rgba(0,0,0,0.2)' }}
              required 
            />
          </div>

          <div className="input-group">
            <label>Secure Email</label>
            <input 
              type="email" 
              className="input-control" 
              placeholder="operator@securevault.io" 
              style={{ background: 'rgba(0,0,0,0.2)' }}
              required 
            />
          </div>

          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label>Master Password</label>
            <input 
              type="password" 
              className="input-control" 
              placeholder="••••••••" 
              style={{ background: 'rgba(0,0,0,0.2)' }}
              required 
            />
          </div>

          <button type="submit" className="btn" style={{ 
            width: '100%', 
            padding: '1rem', 
            background: 'linear-gradient(135deg, var(--color-cyan) 0%, var(--color-primary) 100%)',
            color: '#000',
            fontWeight: 800,
            fontSize: '1rem'
          }}>
            Initialize Vault <Zap size={18} fill="currentColor" />
          </button>
        </form>
      </div>

      {/* Footer Credential */}
      <div style={{ 
        marginTop: '2rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        opacity: 0.5,
        fontSize: '0.75rem',
        fontWeight: 500
      }}>
        <ShieldCheck size={14} className="text-neon" />
        <span>Protected by end-to-end encryption</span>
      </div>

    </div>
  );
};

export default Register;
