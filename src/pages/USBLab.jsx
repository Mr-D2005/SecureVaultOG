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
  ShieldCheck,
  Award,
  Fingerprint
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
  <SpotlightCard glowColor={color} style={{ padding: '1.5rem', height: '100%' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
      <div style={{ background: `rgba(${color === 'red' ? '239,68,68' : color === 'green' ? '16,185,129' : '0,220,156'}, 0.1)`, padding: '0.75rem', borderRadius: '12px' }}>
        <Icon size={24} color={color === 'red' ? '#ef4444' : color === 'green' ? '#00dc9c' : '#00dc9c'} />
      </div>
      {status === 'COMPLETE' && <CheckCircle2 size={18} color="#00dc9c" />}
    </div>
    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 900, color: '#fff' }}>{name.replace('_', ' ')}</h4>
    <div style={{ fontSize: '0.75rem', color: status === 'COMPLETE' ? '#00dc9c' : '#888', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '1px' }}>
      {status}
    </div>
    <p style={{ margin: 0, fontSize: '0.85rem', color: '#aaa', lineHeight: 1.6 }}>
      {report || "Awaiting hardware synchronization..."}
    </p>
  </SpotlightCard>
);

const USBLab = () => {
  const [auditing, setAuditing] = useState(false);
  const [devices, setDevices] = useState([]);
  const [reports, setReports] = useState([]);
  const [logs, setLogs] = useState(["[SYSTEM] Sentinel Core Online.", "[SYSTEM] Probing for hardware bridge..."]);
  const [lastSyncedData, setLastSyncedData] = useState(null);
  const logEndRef = useRef(null);

  const addLog = (msg) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const fetchExternalSync = async () => {
    setAuditing(true);
    addLog("SYNC_ENGINE: Handshaking with local sentinel...");
    try {
      const res = await fetch('/api/usb-lab/latest-external');
      const data = await res.json();
      
      if (data.success && data.report) {
        addLog("SYNC_SUCCESS: Forensic data securely received.");
        setLastSyncedData(data.report);
        setDevices(data.report.devices || []);
        if (data.report.actions_taken && data.report.actions_taken.length > 0) {
          data.report.actions_taken.forEach(action => addLog(`CORRECTION: ${action}`));
        }
        addLog("AUTO_PROTOCOL: Triggering intelligence audit...");
        handleAudit(data.report);
      } else {
        addLog("SYNC_IDLE: No hardware data found in the sync room.");
        setAuditing(false);
      }
    } catch (err) {
      addLog("SYNC_ERROR: Bridge connection failure.");
      setAuditing(false);
    }
  };

  const handleAudit = async (passedData = null) => {
    const dataToAudit = passedData || lastSyncedData;
    if (!dataToAudit) {
      addLog("CRITICAL: No data to audit. Run Sync first.");
      return;
    }

    setAuditing(true);
    setReports([]);
    addLog("SENTINEL_COUNCIL: Initializing council audit...");
    
    try {
      const res = await fetch('/api/usb-lab/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToAudit)
      });
      const data = await res.json();
      if (data.success) {
        setDevices(data.devices);
        setReports(data.reports);
        addLog("SYSTEM_CERTIFIED: Forensic audit complete.");
      } else {
        addLog(`ERROR: ${data.error}`);
      }
    } catch (error) {
      addLog("COMM_ERROR: Forensic Brain unresponsive.");
    } finally {
      setAuditing(false);
    }
  };

  const downloadBridge = () => {
    addLog("SYSTEM: Preparing One-Click Launcher...");
    window.location.href = '/api/usb-lab/download-launcher';
  };

  useEffect(() => {
    if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const isCertified = reports.length > 0 && reports.every(r => r.report.includes('SECURE') || r.report.includes('CLEAN') || r.report.includes('PASS'));

  return (
    <div style={{ 
      padding: '2.5rem', minHeight: '100vh', 
      background: 'linear-gradient(135deg, #05050a 0%, #101025 100%)',
      color: '#fff', fontFamily: '"Outfit", sans-serif'
    }}>
      
      {/* HEADER SECTION */}
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, margin: 0, background: 'linear-gradient(to right, #00dc9c, #0066ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SENTINEL_LAB_V5
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', fontWeight: 500, letterSpacing: '1px' }}>HARDWARE_DNA_FORENSICS // 10_AGENT_COUNCIL</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={downloadBridge} style={{ padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} color="#00dc9c" /> DOWNLOAD_LAUNCHER
          </button>
          <button onClick={fetchExternalSync} disabled={auditing} style={{ padding: '0.8rem 2rem', background: '#0066ff', border: 'none', borderRadius: '14px', color: '#fff', fontWeight: 800, cursor: auditing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 8px 24px rgba(0, 102, 255, 0.3)' }}>
            {auditing ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
            {auditing ? 'ANALYZING...' : 'INITIALIZE_SYNC'}
          </button>
        </div>
      </header>

      {/* TOP STATS / CERTIFICATE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <SpotlightCard glowColor="green" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ color: '#00dc9c', fontSize: '2.5rem', fontWeight: 900 }}>{devices.length}</div>
          <div style={{ color: '#666', fontSize: '0.8rem', fontWeight: 700 }}>HARDWARE_DETECTED</div>
        </SpotlightCard>
        <SpotlightCard glowColor="red" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ color: '#ef4444', fontSize: '2.5rem', fontWeight: 900 }}>{lastSyncedData?.actions_taken?.length || 0}</div>
          <div style={{ color: '#666', fontSize: '0.8rem', fontWeight: 700 }}>THREATS_NEUTRALIZED</div>
        </SpotlightCard>
        <div style={{ gridColumn: 'span 2' }}>
          <SpotlightCard glowColor={isCertified ? "green" : "blue"} style={{ padding: '1.5rem', background: isCertified ? 'rgba(0, 220, 156, 0.05)' : 'rgba(255,255,255,0.02)', border: isCertified ? '1px solid #00dc9c' : '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ background: isCertified ? '#00dc9c' : '#333', padding: '1rem', borderRadius: '16px' }}>
                <ShieldCheck size={32} color={isCertified ? "#000" : "#666"} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: isCertified ? '#00dc9c' : '#fff' }}>
                  {isCertified ? 'HARDWARE_CERTIFIED_CLEAN' : 'AWAITING_CERTIFICATION'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
                  {isCertified ? 'No active malicious vectors identified by Sentinel Council.' : 'Run Sync to begin hardware audit.'}
                </p>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* AGENT GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <AgentCard name="HARDWARE_DNA" status={reports.find(r => r.agent === 'HARDWARE_TEAM') ? "COMPLETE" : "PENDING"} report={reports.find(r => r.agent === 'HARDWARE_TEAM')?.report} icon={Fingerprint} color="purple" />
            <AgentCard name="LOGIC_INTEGRITY" status={reports.find(r => r.agent === 'SOFTWARE_TEAM') ? "COMPLETE" : "PENDING"} report={reports.find(r => r.agent === 'SOFTWARE_TEAM')?.report} icon={Lock} color="green" />
            <AgentCard name="CYBER_SENTINEL" status={reports.find(r => r.agent === 'CYBER_SENTRY_TEAM') ? "COMPLETE" : "PENDING"} report={reports.find(r => r.agent === 'CYBER_SENTRY_TEAM')?.report} icon={Search} color="blue" />
          </div>

          {/* DEVICE DETAILS */}
          {devices.length > 0 && (
            <SpotlightCard style={{ padding: '2rem' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Usb size={20} color="#00dc9c" /> TARGET_DRIVE_DNA
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {devices.map((dev, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#666', fontWeight: 800, marginBottom: '0.5rem' }}>MOUNT_POINT: {dev.mountpoint}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{Math.round(dev.total / (1024**3))} GB {dev.fstype}</div>
                    <div style={{ fontSize: '0.8rem', color: '#00dc9c', marginTop: '0.5rem' }}>STATUS: ACCESSIBLE_CLEAN</div>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          )}
        </div>

        {/* LOG CONSOLE */}
        <SpotlightCard glowColor="blue" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#05050a' }}>
          <div style={{ background: '#0a0a15', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Terminal size={16} color="#0066ff" />
            <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 800 }}>FORENSIC_CONSOLE</span>
          </div>
          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', maxHeight: '700px', fontFamily: '"JetBrains Mono", monospace' }}>
            {logs.map((log, i) => (
              <div key={i} style={{ fontSize: '0.8rem', color: log.includes('CORRECTION') ? '#00dc9c' : log.includes('SUCCESS') ? '#00dc9c' : log.includes('ERROR') ? '#ef4444' : '#555', marginBottom: '0.6rem', borderLeft: log.includes('CORRECTION') ? '2px solid #00dc9c' : 'none', paddingLeft: log.includes('CORRECTION') ? '0.5rem' : '0' }}>
                {log}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </SpotlightCard>

      </div>
    </div>
  );
};

export default USBLab;
