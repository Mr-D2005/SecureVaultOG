import React, { useState, useEffect, useRef } from 'react';
import { 
  Usb, 
  ShieldAlert, 
  Zap, 
  Terminal, 
  Activity, 
  Cpu, 
  Trash2, 
  AlertTriangle,
  CheckCircle2,
  Lock,
  Search,
  HardDrive
} from 'lucide-react';

const SpotlightCard = ({ children, glowColor = 'blue', style = {} }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  
  const colors = {
    blue: 'rgba(0, 220, 180, 0.15)',
    red: 'rgba(239, 68, 68, 0.15)',
    purple: 'rgba(168, 85, 247, 0.15)',
    orange: 'rgba(245, 158, 11, 0.15)',
    green: 'rgba(16, 185, 129, 0.15)'
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: '16px',
        background: 'rgba(5, 5, 10, 0.85)',
        border: '1px solid rgba(255,255,255,0.08)',
        ...style
      }}
    >
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none',
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${colors[glowColor]}, transparent 40%)`,
          zIndex: 0, transition: 'background 0.3s ease'
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
};

const AgentCard = ({ name, status, report, icon: Icon, color }) => (
  <SpotlightCard glowColor={color} style={{ padding: '1.25rem', height: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
      <div style={{ background: `rgba(${color === 'red' ? '239,68,68' : color === 'green' ? '16,185,129' : '168,85,247'}, 0.1)`, padding: '0.5rem', borderRadius: '8px' }}>
        <Icon size={18} color={color === 'red' ? '#ef4444' : color === 'green' ? '#10b981' : '#a855f7'} />
      </div>
      <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 900, color: '#fff', letterSpacing: '0.5px' }}>{name.toUpperCase()}</h4>
    </div>
    <div style={{ fontSize: '0.75rem', color: status === 'COMPLETE' ? '#10b981' : '#888', fontWeight: 700, marginBottom: '0.5rem' }}>
      STATUS: {status}
    </div>
    <p style={{ margin: 0, fontSize: '0.8rem', color: '#ccc', lineHeight: 1.4, height: '60px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
      {report || "Awaiting audit initialization..."}
    </p>
  </SpotlightCard>
);

const USBLab = () => {
  const [auditing, setAuditing] = useState(false);
  const [devices, setDevices] = useState([]);
  const [reports, setReports] = useState([]);
  const [logs, setLogs] = useState(["[SYSTEM] Sentinel Council initialized.", "[SYSTEM] Awaiting hardware bridge connection..."]);
  const logEndRef = useRef(null);

  const addLog = (msg) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleAudit = async () => {
    setAuditing(true);
    setReports([]);
    addLog("PROBING HARDWARE: Initiating Sentinel Council Handshake...");
    
    try {
      const res = await fetch('/api/usb-lab/audit');
      const data = await res.json();
      
      if (data.success) {
        if (data.is_simulated) {
          addLog("HARDWARE_BRIDGE: Physical sensors unavailable in cloud environment.");
          addLog("SENTINEL_PROTOCOL: Initiating High-Threat Forensic Simulation...");
          addLog("VIRTUAL_VOLUME: Loaded 'VIRTUAL_VOL_SENTINEL' with 4 suspicious objects.");
        }
        
        setDevices(data.devices);
        setReports(data.reports);
        if (!data.is_simulated) {
          addLog(`HARDWARE_FOUND: ${data.devices.length} drive(s) detected.`);
        }
        addLog("AUDIT_COMPLETE: All 10 Sentinels have submitted forensic reports.");
      } else {
        addLog(`CRITICAL_ERROR: ${data.error}`);
      }
    } catch (err) {
      addLog(`CONNECTION_FAILED: Hardware bridge unresponsive. Ensure 'usb_bridge.py' is running.`);
    } finally {
      setAuditing(false);
    }
  };

  useEffect(() => {
    if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const agents = [
    { id: 'HID-Shield', icon: Lock, color: 'purple' },
    { id: 'Script-Slayer', icon: ShieldAlert, color: 'red' },
    { id: 'Malware-Probe', icon: Search, color: 'red' },
    { id: 'Firmware-Auditor', icon: Cpu, color: 'purple' },
    { id: 'Siphon-Guard', icon: Zap, color: 'orange' },
    { id: 'Bait-Analyst', icon: AlertTriangle, color: 'orange' },
    { id: 'Integrity-Vigil', icon: HardDrive, color: 'green' },
    { id: 'Power-Sentry', icon: Zap, color: 'red' },
    { id: 'Stego-Scanner', icon: Search, color: 'blue' },
    { id: 'Purifier', icon: Trash2, color: 'green' }
  ];

  return (
    <div style={{ 
      padding: '2rem', 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top right, #0a0a1a 0%, #000 100%)',
      color: '#fff',
      fontFamily: '"Inter", sans-serif'
    }}>
      {/* HEADER */}
      <div style={{ marginBottom: '3rem', borderLeft: '4px solid #00dc9c', paddingLeft: '1.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>
          USB_FORENSIC_LAB <span style={{ color: '#00dc9c', fontSize: '1rem', verticalAlign: 'top' }}>[SENTINEL_COUNCIL]</span>
        </h1>
        <p style={{ color: '#888', marginTop: '0.5rem' }}>Absolute Hardware Security Audit • 10-Agent Collaborative Defense</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        
        {/* MAIN PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* CONTROLS */}
          <SpotlightCard glowColor="blue" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ background: 'rgba(0, 220, 156, 0.1)', padding: '1rem', borderRadius: '12px' }}>
                  <Usb size={32} color="#00dc9c" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Sentinel Council Audit</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>Deploy all 10 specialized agents to the connected hardware.</p>
                </div>
              </div>
              <button 
                onClick={handleAudit}
                disabled={auditing}
                style={{
                  padding: '1rem 2.5rem',
                  background: auditing ? '#333' : 'linear-gradient(135deg, #00dc9c, #0066ff)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontWeight: 900,
                  cursor: auditing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 10px 20px rgba(0, 220, 156, 0.2)'
                }}
              >
                {auditing ? <Activity className="animate-spin" size={20} /> : <Zap size={20} />}
                {auditing ? 'DEPLOYING_AGENTS...' : 'INITIATE_FULL_AUDIT'}
              </button>
            </div>
          </SpotlightCard>

          {/* AGENT GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
            {agents.map(agent => {
                const report = reports.find(r => r.agent === agent.id);
                return (
                    <AgentCard 
                        key={agent.id}
                        name={agent.id}
                        status={report ? "COMPLETE" : (auditing ? "SCANNING" : "IDLE")}
                        report={report?.report}
                        icon={agent.icon}
                        color={agent.color}
                    />
                );
            })}
          </div>

          {/* DETECTED DEVICES */}
          {devices.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {devices.map((dev, i) => (
                    <SpotlightCard key={i} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <HardDrive size={24} color="#00dc9c" />
                            <div>
                                <div style={{ fontSize: '1rem', fontWeight: 900 }}>{dev.mountpoint || dev.device}</div>
                                <div style={{ fontSize: '0.75rem', color: '#666' }}>{dev.fstype} • {Math.round(dev.total / (1024**3))} GB Total</div>
                            </div>
                        </div>
                    </SpotlightCard>
                ))}
            </div>
          )}
        </div>

        {/* SIDEBAR: CONSOLE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <SpotlightCard glowColor="blue" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#111', padding: '0.75rem 1.25rem', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Terminal size={14} color="#666" />
                <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 700 }}>SENTINEL_COUNCIL_LOG</span>
            </div>
            <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', maxHeight: '600px', fontFamily: '"JetBrains Mono", monospace' }}>
                {logs.map((log, i) => (
                    <div key={i} style={{ fontSize: '0.8rem', color: log.includes('CRITICAL') ? '#ef4444' : log.includes('AUDIT_COMPLETE') ? '#10b981' : '#888', marginBottom: '0.5rem' }}>
                        {log}
                    </div>
                ))}
                <div ref={logEndRef} />
            </div>
          </SpotlightCard>
        </div>

      </div>
    </div>
  );
};

export default USBLab;
