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
  HardDrive,
  Download,
  RefreshCw,
  ShieldCheck
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

  const [lastSyncedData, setLastSyncedData] = useState(null);

  const fetchExternalSync = async () => {
    setAuditing(true);
    addLog("SYNC_ENGINE: Checking for data from Local Sentinel Bridge...");
    try {
      const res = await fetch('/api/usb-lab/latest-external');
      const data = await res.json();
      
      if (data.success && data.report) {
        addLog("SYNC_SUCCESS: Local hardware data received.");
        setLastSyncedData(data.report); // SAVE THE DATA TO MEMORY
        setDevices(data.report.devices || []);
        if (data.report.actions_taken && data.report.actions_taken.length > 0) {
          data.report.actions_taken.forEach(action => addLog(`CORRECTION: ${action}`));
        }
      } else {
        addLog("SYNC_IDLE: No new data pushed from local bridge yet.");
      }
    } catch (err) {
      addLog("SYNC_ERROR: Connection to Cloud Engine failed.");
    } finally {
      setAuditing(false);
    }
  };

  const handleAudit = async () => {
    // USE THE SAVED DATA FROM MEMORY
    const dataToAudit = lastSyncedData;
    
    if (!dataToAudit || !dataToAudit.devices || dataToAudit.devices.length === 0) {
      addLog("CRITICAL_ERROR: No forensic data found. Run 'FETCH_LOCAL_SYNC' first.");
      return;
    }

    setAuditing(true);
    setReports([]);
    addLog("SENTINEL_COUNCIL: Initializing council handshake...");
    
    try {
      addLog("SENTINEL_PRIME: Deploying Strike Teams to forensic data...");
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch('/api/usb-lab/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToAudit)
      });

      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`HTTP_${res.status}: Brain connection timeout.`);

      const data = await res.json();
      
      if (data.success) {
        setDevices(data.devices);
        setReports(data.reports);
        addLog("SYSTEM_CERTIFIED: All Strike Teams have submitted forensic reports.");
        addLog(`HARDWARE_AUDIT_COMPLETE: ${data.devices.length} device(s) analyzed.`);
      } else {
        addLog(`CRITICAL_ERROR: ${data.error}`);
      }
    } catch (error) {
      addLog(`COMM_ERROR: ${error.name === 'AbortError' ? 'Timeout' : error.message}`);
    } finally {
      setAuditing(false);
    }
  };

  const downloadBridge = () => {
    addLog("SYSTEM: Preparing Sentinel One-Click Launcher for local download...");
    window.location.href = `${import.meta.env.VITE_API_URL || ''}/api/usb-lab/download-launcher`;
  };

  useEffect(() => {
    if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const agents = [
    { id: 'HARDWARE_TEAM', icon: Cpu, color: 'purple' },
    { id: 'SOFTWARE_TEAM', icon: ShieldAlert, color: 'red' },
    { id: 'CYBER_SENTRY_TEAM', icon: Search, color: 'blue' }
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
      <div style={{ marginBottom: '3rem', borderLeft: '4px solid #00dc9c', paddingLeft: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>
            USB_FORENSIC_LAB <span style={{ color: '#00dc9c', fontSize: '1rem', verticalAlign: 'top' }}>[SENTINEL_VANGUARD]</span>
          </h1>
          <p style={{ color: '#888', marginTop: '0.5rem' }}>Exhaustive Hardware Security Audit • 10-Agent Collaborative Defense</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={downloadBridge}
            style={{ padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,220,156,0.3)', borderRadius: '12px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Download size={18} /> DOWNLOAD_BRIDGE
          </button>
          
          <button 
            onClick={fetchExternalSync}
            disabled={auditing}
            style={{ padding: '0.75rem 1.25rem', background: 'rgba(0,102,255,0.1)', border: '1px solid #0066ff', borderRadius: '12px', color: '#0066ff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
          >
            <RefreshCw size={18} className={auditing ? 'animate-spin' : ''} /> FETCH_LOCAL_SYNC
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        
        {/* MAIN PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* SYNC ALERT */}
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1.25rem', borderRadius: '16px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <ShieldAlert color="#f59e0b" />
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#f59e0b', fontWeight: 500 }}>
              <strong>CLOUD_SYNC_ACTIVE:</strong> To check a physical USB, download the <strong>SENTINEL_BRIDGE</strong>, run it on your machine, then click <strong>FETCH_LOCAL_SYNC</strong>.
            </p>
          </div>

          {/* CONTROLS */}
          <SpotlightCard glowColor="blue" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ background: 'rgba(0, 220, 156, 0.1)', padding: '1rem', borderRadius: '12px' }}>
                  <Usb size={32} color="#00dc9c" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Sentinel Council Audit</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>Deploy all 10 specialized agents to analyze synced hardware data.</p>
                </div>
              </div>
              <button 
                onClick={() => handleAudit()}
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
                {auditing ? 'ANALYZING_HARDWARE...' : 'RUN_CLOUD_AUDIT'}
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
                                <div style={{ fontSize: '0.75rem', color: '#666' }}>{dev.fstype || 'Removable Storage'} • {dev.total ? Math.round(dev.total / (1024**3)) : '??'} GB Total</div>
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
                    <div key={i} style={{ fontSize: '0.8rem', color: log.includes('CRITICAL') ? '#ef4444' : log.includes('CORRECTION') ? '#00dc9c' : log.includes('AUDIT_COMPLETE') ? '#10b981' : '#888', marginBottom: '0.5rem' }}>
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
