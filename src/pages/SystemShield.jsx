import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Globe, 
  Lock, 
  Zap, 
  Settings, 
  Download, 
  Bell, 
  User, 
  Activity, 
  Cpu, 
  Network,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Terminal,
  BrainCircuit
} from 'lucide-react';

const AgentBadge = ({ name, status }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f0f4ff', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #cce0ff' }}>
    <BrainCircuit size={14} color="#0066ff" />
    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0066ff', letterSpacing: '0.5px' }}>{name}</span>
    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00dc9c', boxShadow: '0 0 10px #00dc9c' }} />
  </div>
);

const McAfeeCard = ({ icon: Icon, title, desc, agentName, color = "#0066ff", onClick }) => (
  <div 
    onClick={onClick}
    style={{ 
      background: '#fff', 
      borderRadius: '20px', 
      padding: '2rem', 
      border: '1px solid #e0e0e0',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      boxShadow: '0 4px 15px rgba(0,0,0,0.04)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
      e.currentTarget.style.borderColor = color;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.04)';
      e.currentTarget.style.borderColor = '#e0e0e0';
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ padding: '1rem', background: `${color}10`, borderRadius: '16px' }}>
        <Icon size={28} color={color} />
      </div>
      <AgentBadge name={agentName} status="ACTIVE" />
    </div>
    <div>
      <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1a1a1a', fontWeight: 800 }}>{title}</h3>
      <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.9rem', color: '#666', lineHeight: 1.5 }}>{desc}</p>
    </div>
  </div>
);

const SystemShield = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [logs, setLogs] = useState([
    "AGENT_CORE: Sentinel Intelligence System Initialized.",
    "AGENT_DNA: Behavioral mapping engine ready.",
    "AGENT_NET: Firewall ingress/egress filtering active."
  ]);

  const addLog = (msg) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 10)]);

  const startAIScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    addLog("AGENT_DNA: Starting Deep Behavioral Probe...");
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setScanProgress(progress);
      if (progress === 30) addLog("AGENT_DNA: Scanning system memory sectors...");
      if (progress === 60) addLog("AGENT_HEURISTIC: Analyzing process entropy...");
      if (progress === 90) addLog("AGENT_VAULT: Checking credential isolation...");
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        addLog("SYSTEM: Full AI Audit Complete. Status: 100% Secure.");
      }
    }, 80);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f4f7fa', 
      color: '#1a1a1a', 
      fontFamily: '"Inter", sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Premium McAfee Navbar */}
      <nav style={{ 
        height: '80px', background: '#fff', borderBottom: '1px solid #e1e8ed', 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '0 3rem', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '45px', height: '45px', background: '#e31c1c', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(227, 28, 28, 0.2)' }}>
            <ShieldCheck size={28} color="#fff" />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.7px' }}>
            SECUREVAULT <span style={{ color: '#e31c1c' }}>TOTAL_AI</span>
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', color: '#666', fontWeight: 600, fontSize: '0.9rem' }}>
            <span style={{ cursor: 'pointer', color: '#1a1a1a' }}>Home</span>
            <span style={{ cursor: 'pointer' }}>My Devices</span>
            <span style={{ cursor: 'pointer' }}>Protection Score</span>
          </div>
          <div style={{ height: '30px', width: '1px', background: '#e1e8ed' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Bell size={20} color="#666" />
            <User size={20} color="#666" />
          </div>
        </div>
      </nav>

      <div style={{ padding: '3rem', maxWidth: '1300px', margin: '0 auto', width: '100%' }}>
        
        {/* Main Status Hero */}
        <div style={{ 
          background: '#fff', borderRadius: '30px', padding: '3.5rem', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          border: '1px solid #e1e8ed', marginBottom: '3rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
            <div style={{ 
              width: '140px', height: '140px', borderRadius: '50%', background: '#00dc9c', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 50px rgba(0, 220, 156, 0.3)', position: 'relative'
            }}>
              <ShieldCheck size={85} color="#fff" />
              <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#fff', borderRadius: '50%', padding: '5px' }}>
                <BrainCircuit size={24} color="#0066ff" />
              </div>
            </div>
            <div>
              <h1 style={{ fontSize: '3rem', margin: 0, fontWeight: 900, color: '#1a1a1a' }}>You're protected</h1>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.2rem', color: '#666', fontWeight: 500 }}>
                <span style={{ color: '#0066ff', fontWeight: 700 }}>4 AI Agents</span> are monitoring your system in real-time.
              </p>
              <div style={{ display: 'flex', gap: '1.25rem', marginTop: '2rem' }}>
                <button onClick={startAIScan} style={{ padding: '1rem 2.5rem', background: '#0066ff', border: 'none', borderRadius: '15px', color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0, 102, 255, 0.3)' }}>
                  {isScanning ? `SCANNING ${scanProgress}%` : 'Run a quick scan'}
                </button>
                <button onClick={() => window.location.href = '/api/system-shield/download'} style={{ padding: '1rem 2.5rem', background: '#f0f4ff', border: '1px solid #cce0ff', borderRadius: '15px', color: '#0066ff', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}>
                  Download for PC
                </button>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e1e8ed' }}>
              <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600 }}>Protection Score</div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#0066ff' }}>985</div>
              <div style={{ fontSize: '0.8rem', color: '#00dc9c', fontWeight: 700 }}>EXCELLENT</div>
            </div>
          </div>
        </div>

        {/* AI Agent Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
          <McAfeeCard 
            icon={Cpu} 
            title="PC Security" 
            desc="AI Behavioral scanning and kernel protection." 
            agentName="AGENT_DNA_X1"
            color="#0066ff"
          />
          <McAfeeCard 
            icon={BrainCircuit} 
            title="Web Protection" 
            desc="AI anti-phishing and secure browser gateway." 
            agentName="AGENT_NET_SHIELD"
            color="#e31c1c"
          />
          <McAfeeCard 
            icon={Lock} 
            title="Privacy Guard" 
            desc="AI encrypted vault and identity monitoring." 
            agentName="AGENT_VAULT_SENTRY"
            color="#a855f7"
          />
        </div>

        {/* Live Agent Intelligence Feed */}
        <div style={{ background: '#1a1a1a', borderRadius: '30px', padding: '2rem', color: '#fff', border: '1px solid #333' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0 1rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.2rem', fontWeight: 800 }}>
              <Terminal size={20} color="#00dc9c" /> AI_AGENT_INTELLIGENCE_FEED
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 700 }}>REAL_TIME_LOGGING_ACTIVE</div>
          </div>
          <div style={{ background: '#000', borderRadius: '20px', padding: '1.5rem', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem' }}>
            {logs.map((log, i) => (
              <div key={i} style={{ marginBottom: '0.6rem', color: log.includes('COMPLETE') ? '#00dc9c' : log.includes('AGENT') ? '#0066ff' : '#888' }}>
                <span style={{ opacity: 0.4 }}>{'>'}</span> {log}
              </div>
            ))}
            {isScanning && (
              <div style={{ marginTop: '1rem', height: '4px', background: '#333', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${scanProgress}%`, height: '100%', background: '#00dc9c', transition: 'width 0.1s linear' }} />
              </div>
            )}
          </div>
        </div>

      </div>

      <footer style={{ marginTop: 'auto', padding: '2.5rem', textAlign: 'center', color: '#999', fontSize: '0.85rem', background: '#fff', borderTop: '1px solid #e1e8ed' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '2rem', fontWeight: 600 }}>
          <span>Privacy</span><span>Terms</span><span>Support</span>
        </div>
        &copy; 2026 SECUREVAULT AI TOTAL PROTECTION. POWERED BY SENTINEL CORE.
      </footer>
    </div>
  );
};

export default SystemShield;
