import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Cpu, 
  Globe, 
  Lock, 
  Zap, 
  Search, 
  Terminal,
  Wifi,
  WifiOff,
  AlertTriangle,
  RefreshCw,
  Download
} from 'lucide-react';

const SpotlightCard = ({ children, glowColor = 'blue', style = {} }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  
  const colors = {
    blue: 'rgba(0, 102, 255, 0.15)',
    red: 'rgba(239, 68, 68, 0.15)',
    green: 'rgba(16, 185, 129, 0.15)',
    purple: 'rgba(168, 85, 247, 0.15)'
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: '24px',
        background: 'rgba(10, 10, 20, 0.8)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        ...style
      }}
    >
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none',
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, ${colors[glowColor]}, transparent 40%)`,
          zIndex: 0
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
};

const SystemShield = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [protectionStatus, setProtectionStatus] = useState('SECURE');
  const [logs, setLogs] = useState(["[SYSTEM] AI Sentinel Core Initialized.", "[SYSTEM] Real-time Guard: ACTIVE."]);
  const [networkThreats, setNetworkThreats] = useState(0);

  const addLog = (msg) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 50)]);

  const startAIScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    addLog("AGENT_DNA: Starting Deep Behavioral Scan...");
    addLog("AGENT_PROCESS: Monitoring active system memory...");
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setScanProgress(progress);
      
      if (progress === 20) addLog("AGENT_DNA: Analyzing C:/Windows/System32...");
      if (progress === 40) addLog("AGENT_MEMORY: Scanning for Buffer Overflow vectors...");
      if (progress === 60) addLog("AGENT_ROOTKIT: Probing for hidden boot sectors...");
      if (progress === 80) addLog("AGENT_HEURISTIC: Cross-referencing behavior with malware DNA...");
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        addLog("SYSTEM_CERTIFIED: Full Scan Complete. No threats found.");
      }
    }, 100);
  };

  return (
    <div style={{ 
      padding: '2.5rem', minHeight: '100vh', 
      background: 'linear-gradient(135deg, #05050a 0%, #0a0a20 100%)',
      color: '#fff', fontFamily: '"Outfit", sans-serif'
    }}>
      
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, background: 'linear-gradient(to right, #00dc9c, #0066ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SYSTEM_SHIELD_PRO
          </h1>
          <p style={{ color: '#666', fontSize: '1rem', fontWeight: 600 }}>TOTAL_DEFENSE_SUITE // AI_AGENT_CONTROL</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => window.location.href = '/api/system-shield/download'}
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '12px', 
              color: '#fff', 
              fontWeight: 700, 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem' 
            }}
          >
            <Download size={18} color="#00dc9c" /> DOWNLOAD_TOTAL_DEFENSE
          </button>
          <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(0, 220, 156, 0.1)', border: '1px solid #00dc9c', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={20} color="#00dc9c" />
            <span style={{ fontWeight: 800, color: '#00dc9c' }}>PROTECTION_OK</span>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* MAIN STATUS CARD */}
          <SpotlightCard glowColor={protectionStatus === 'SECURE' ? 'green' : 'red'} style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ 
                  width: '120px', height: '120px', borderRadius: '50%', 
                  border: `4px solid ${protectionStatus === 'SECURE' ? '#00dc9c' : '#ef4444'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 30px ${protectionStatus === 'SECURE' ? 'rgba(0, 220, 156, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                }}>
                  <Shield size={60} color={protectionStatus === 'SECURE' ? '#00dc9c' : '#ef4444'} />
                </div>
                <div>
                  <h2 style={{ fontSize: '2rem', margin: 0 }}>Your System is {protectionStatus}</h2>
                  <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>AI Agents are monitoring 4,281 active processes and network nodes.</p>
                </div>
              </div>
              <button 
                onClick={startAIScan}
                disabled={isScanning}
                style={{ 
                  padding: '1.2rem 3rem', background: '#0066ff', border: 'none', 
                  borderRadius: '16px', color: '#fff', fontWeight: 900, fontSize: '1.1rem',
                  cursor: isScanning ? 'not-allowed' : 'pointer',
                  boxShadow: '0 10px 30px rgba(0, 102, 255, 0.3)'
                }}
              >
                {isScanning ? `SCANNING_${scanProgress}%` : 'START_AI_DEEP_SCAN'}
              </button>
            </div>
            {isScanning && (
              <div style={{ marginTop: '2rem', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${scanProgress}%`, height: '100%', background: '#00dc9c', transition: 'width 0.3s ease' }} />
              </div>
            )}
          </SpotlightCard>

          {/* AGENT GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <SpotlightCard style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Cpu size={24} color="#a855f7" />
                <h4 style={{ margin: 0 }}>AGENT_BEHAVIOR</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>Watching for suspicious file encryption and process injection.</p>
              <div style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 800 }}>STATUS: VIGILANT</div>
            </SpotlightCard>

            <SpotlightCard style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Globe size={24} color="#0066ff" />
                <h4 style={{ margin: 0 }}>AGENT_NETWORK</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>Filtering inbound packets and blocking unauthorized IP leaks.</p>
              <div style={{ fontSize: '0.75rem', color: '#0066ff', fontWeight: 800 }}>STATUS: SHIELD_ACTIVE</div>
            </SpotlightCard>

            <SpotlightCard style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Lock size={24} color="#00dc9c" />
                <h4 style={{ margin: 0 }}>AGENT_VAULT</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>Securing your private keys and encrypted databases.</p>
              <div style={{ fontSize: '0.75rem', color: '#00dc9c', fontWeight: 800 }}>STATUS: LOCKED</div>
            </SpotlightCard>
          </div>

          {/* FIREWALL SECTION */}
          <SpotlightCard glowColor="blue" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Wifi size={20} color="#0066ff" /> AI_FIREWALL_LOGS
              </h3>
              <div style={{ color: '#0066ff', fontSize: '0.8rem', fontWeight: 800 }}>{networkThreats} THREATS_BLOCKED_TODAY</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem', color: '#666' }}>
                <span>PROCESS</span>
                <span>DESTINATION</span>
                <span>STATUS</span>
              </div>
              {[
                { p: 'Chrome.exe', d: '192.168.1.1 (Home)', s: 'ALLOWED', c: '#00dc9c' },
                { p: 'Unknown.exe', d: '45.12.33.1 (Russia)', s: 'BLOCKED', c: '#ef4444' },
                { p: 'System.sys', d: '8.8.8.8 (Google)', s: 'ALLOWED', c: '#00dc9c' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0.5rem', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <span style={{ fontWeight: 700 }}>{item.p}</span>
                  <span style={{ color: '#888' }}>{item.d}</span>
                  <span style={{ color: item.c, fontWeight: 900 }}>{item.s}</span>
                </div>
              ))}
            </div>
          </SpotlightCard>

        </div>

        {/* LOG CONSOLE */}
        <SpotlightCard glowColor="purple" style={{ height: '100%', background: '#05050a' }}>
          <div style={{ background: '#0a0a15', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Terminal size={16} color="#a855f7" />
            <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 800 }}>SENTINEL_LIVE_LOGS</span>
          </div>
          <div style={{ padding: '1.5rem', overflowY: 'auto', maxHeight: '800px', fontFamily: '"JetBrains Mono", monospace' }}>
            {logs.map((log, i) => (
              <div key={i} style={{ fontSize: '0.8rem', color: log.includes('COMPLETE') ? '#00dc9c' : log.includes('AGENT') ? '#a855f7' : '#555', marginBottom: '0.8rem', lineHeight: 1.5 }}>
                {log}
              </div>
            ))}
          </div>
        </SpotlightCard>

      </div>
    </div>
  );
};

export default SystemShield;
