import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  ShieldAlert, 
  Search, 
  Terminal, 
  Activity, 
  Globe, 
  Database, 
  Cpu, 
  Lock, 
  Unlock,
  AlertTriangle,
  Zap,
  History,
  Info,
  RotateCcw
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
    orange: 'rgba(245, 158, 11, 0.15)'
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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div style={{ color: 'red', padding: '2rem' }}>UI Initialization Error</div>;
    return this.props.children;
  }
}

const ThreatIntelInner = () => {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [trapLogs, setTrapLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('SCAN'); 
  const logEndRef = useRef(null);

  const fetchTrapLogs = async () => {
    try {
      const res = await fetch('/api/threat/trap-logs');
      const data = await res.json();
      setTrapLogs(data);
    } catch (err) {}
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/threat/history');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error('History fetch failed');
    }
  };

  const location = useLocation();

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchTrapLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlParam = params.get('url');
    if (urlParam) {
      setUrl(urlParam);
      // Give the UI a moment to initialize before triggering scan
      setTimeout(() => {
        handleScan(urlParam);
      }, 600);
    }
  }, [location.search]);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result?.logs]);

  const handleScan = async (urlOverride = null) => {
    const scanUrl = urlOverride || url;
    if (!scanUrl) return;
    setScanning(true);
    setResult(null);
    try {
      const res = await fetch('/api/threat/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: scanUrl })
      });
      const data = await res.json();
      setResult(data);
      fetchHistory();
    } catch (err) {
      console.error('Scan failed');
    } finally {
      setScanning(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setResult(null);
  };

  const handleTarpit = async () => {
    if (!result) return;
    try {
      const res = await fetch('/api/threat/deploy-tarpit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: result.targetUrl, scanId: result.id })
      });
      const data = await res.json();
      setResult({ ...result, tarpitActivated: true, trapUrl: data.trapUrl });
      fetchHistory();
    } catch (err) {
      console.error('Tarpit deployment failed');
    }
  };

  return (
    <div style={{ 
      padding: '2rem', 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top right, #0a0a1a 0%, #000 100%)',
      color: '#fff',
      fontFamily: '"Inter", sans-serif'
    }}>
      
      {/* HEADER SECTION */}
      <div style={{ marginBottom: '3rem', borderLeft: '4px solid var(--color-primary)', paddingLeft: '1.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px', margin: 0, color: '#fff' }}>
          ADVERSARIAL_INTEL <span style={{ color: 'var(--color-primary)', fontSize: '1rem', verticalAlign: 'top' }}>[v4.5]</span>
        </h1>
        <p style={{ color: '#888', marginTop: '0.5rem', fontSize: '1rem' }}>Sentinel AI Forensic Grid • AI-Powered Threat Neutralization</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        
        {/* MAIN ANALYSIS CORE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <SpotlightCard glowColor="blue" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ position: 'relative', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} size={20} />
                <input 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="ENTER TARGET DOMAIN OR URL FOR FORENSIC DEEP-SCAN..."
                  style={{
                    width: '100%',
                    padding: '1.25rem 1rem 1.25rem 3.5rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              <button 
                onClick={() => handleScan()}
                disabled={scanning}
                style={{
                  padding: '1.25rem 2rem',
                  background: scanning ? '#333' : 'linear-gradient(135deg, var(--color-primary), #6366f1)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontWeight: 800,
                  cursor: scanning ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  boxShadow: scanning ? 'none' : '0 10px 20px rgba(79, 70, 229, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                {scanning ? <Activity className="animate-spin" size={20} /> : <Zap size={20} />}
                {scanning ? 'SCANNING...' : 'INITIATE_SCAN'}
              </button>
              <button 
                onClick={handleReset}
                disabled={scanning}
                style={{
                  padding: '1.25rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  cursor: scanning ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                title="Reset Scan"
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </SpotlightCard>

          {/* ANALYSIS RESULTS GRID */}
          {result && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', animation: 'fadeIn 0.5s ease' }}>
              
              {/* RISK METER */}
              <SpotlightCard glowColor={result.riskScore > 40 ? "red" : "green"} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: '180px', height: '180px', borderRadius: '50%', border: '8px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ 
                    position: 'absolute', 
                    width: '100%', 
                    height: '100%', 
                    borderRadius: '50%', 
                    border: `8px solid ${result.riskScore > 40 ? '#ef4444' : '#10b981'}`,
                    clipPath: `inset(${100 - result.riskScore}% 0 0 0)`,
                    transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    filter: 'blur(2px)'
                  }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1 }}>{result.riskScore}%</div>
                    <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600, letterSpacing: '2px', marginTop: '0.5rem' }}>THREAT_INDEX</div>
                  </div>
                </div>
                <div style={{ 
                  marginTop: '1.5rem', 
                  padding: '0.5rem 1.5rem', 
                  borderRadius: '20px', 
                  background: result.riskScore > 40 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                  color: result.riskScore > 40 ? '#ef4444' : '#10b981',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  border: `1px solid ${result.riskScore > 40 ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`
                }}>
                  {result.riskScore > 40 ? 'CRITICAL_RISK_DETECTED' : 'SYSTEM_VERIFIED_BENIGN'}
                </div>
              </SpotlightCard>

              {/* FORENSIC GRID */}
              <div style={{ display: 'grid', gridTemplateRows: 'repeat(2, 1fr)', gap: '1rem' }}>
                <SpotlightCard style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                    <Globe size={24} color="var(--color-primary)" />
                  </div>
                  <div>
                    <div style={{ color: '#888', fontSize: '0.75rem', fontWeight: 700 }}>TARGET_HOST</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{result.hostname}</div>
                  </div>
                </SpotlightCard>
                <SpotlightCard style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                    <Database size={24} color="#f59e0b" />
                  </div>
                  <div>
                    <div style={{ color: '#888', fontSize: '0.75rem', fontWeight: 700 }}>INFRASTRUCTURE</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                      {result.threatReason || 'LEGITIMATE_CORE'}
                    </div>
                  </div>
                </SpotlightCard>
              </div>

              {/* AI SENTINEL REPORT */}
              <SpotlightCard glowColor="purple" style={{ gridColumn: 'span 2', padding: '1.5rem', borderLeft: '4px solid #a855f7' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <Cpu size={18} color="#a855f7" />
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#a855f7', fontWeight: 900 }}>AI_SENTINEL_FORENSIC_REPORT</h4>
                </div>
                <p style={{ margin: 0, color: '#ccc', lineHeight: 1.6, fontStyle: 'italic', fontSize: '1.05rem' }}>
                  "{result.logs.find(l => l.includes('[AI SENTINEL ASSESSMENT]'))?.split(']: ')[1] || 'Analysis complete.'}"
                </p>
              </SpotlightCard>

              {/* NEUTRALIZATION PANEL */}
              {result.riskScore > 40 && (
                <SpotlightCard glowColor="orange" style={{ gridColumn: 'span 2', padding: '1.5rem', background: 'rgba(245,158,11,0.05)', border: '1px dashed rgba(245,158,11,0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <ShieldAlert size={32} color="#f59e0b" />
                      <div>
                        <h4 style={{ margin: 0, color: '#f59e0b', fontSize: '1.1rem' }}>ACTIVE_THREAT_NEUTRALIZATION</h4>
                        <p style={{ margin: 0, color: '#888', fontSize: '0.85rem' }}>Deploy TCP Tarpit to drain attacker server resources.</p>
                      </div>
                    </div>
                    {result.tarpitActivated ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 900 }}>
                        <Lock size={18} /> NEUTRALIZED
                      </div>
                    ) : (
                      <button 
                        onClick={handleTarpit}
                        style={{
                          padding: '0.75rem 1.5rem',
                          background: '#f59e0b',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#000',
                          fontWeight: 900,
                          cursor: 'pointer',
                          boxShadow: '0 5px 15px rgba(245,158,11,0.2)'
                        }}
                      >
                        DEPLOY_TARPIT
                      </button>
                    )}
                  </div>
                  {result.tarpitActivated && (
                    <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.75rem', color: '#10b981' }}>
                      {'>'} ATTACKER_TRAP_ACTIVE: {result.trapUrl}
                    </div>
                  )}
                </SpotlightCard>
              )}

              {/* LIVE CONSOLE */}
              <SpotlightCard glowColor="blue" style={{ gridColumn: 'span 2', padding: '0', background: '#000', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ background: '#111', padding: '0.75rem 1.25rem', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Terminal size={14} color="#666" />
                  <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 700 }}>SENTINEL_FORENSIC_CONSOLE</span>
                </div>
                <div style={{ padding: '1.5rem', maxHeight: '250px', overflowY: 'auto', fontFamily: '"JetBrains Mono", monospace' }}>
                  {result.logs.map((log, i) => (
                    <div key={i} style={{ 
                      color: log.includes('[CRITICAL]') || log.includes('[WARN]') ? '#ef4444' : 
                             log.includes('[INFO]') || log.includes('[CLEAN]') ? '#10b981' : '#888',
                      marginBottom: '0.5rem',
                      fontSize: '0.85rem',
                      display: 'flex',
                      gap: '0.75rem'
                    }}>
                      <span style={{ opacity: 0.3 }}>[{i.toString().padStart(2, '0')}]</span>
                      <span>{log}</span>
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </SpotlightCard>

            </div>
          )}
        </div>

        {/* SIDEBAR: HISTORY & INTEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <SpotlightCard style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <History size={20} color="var(--color-primary)" />
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff', letterSpacing: '1px' }}>RECENT_INVESTIGATIONS</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {history.length > 0 ? history.map((item) => (
                <div key={item.id} style={{ 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  background: 'rgba(255,255,255,0.03)', 
                  borderLeft: `3px solid ${item.isSuspicious ? '#ef4444' : '#10b981'}`,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onClick={() => { setUrl(item.targetUrl); setResult(item); }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.hostname}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 900, 
                      color: item.isSuspicious ? '#ef4444' : '#10b981',
                      padding: '0.2rem 0.5rem',
                      background: item.isSuspicious ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                      borderRadius: '4px'
                    }}>
                      {item.isSuspicious ? 'THREAT' : 'SAFE'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#555' }}>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#444', fontSize: '0.85rem' }}>
                  No historical data available.
                </div>
              )}
            </div>
          </SpotlightCard>

          <SpotlightCard glowColor="purple" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(168,85,247,0.05), transparent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Info size={18} color="#a855f7" />
              <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#fff' }}>INTEL_CORE_STATUS</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: '#666' }}>SENTINEL_AI</span>
                <span style={{ color: '#10b981', fontWeight: 900 }}>OPERATIONAL</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: '#666' }}>FORENSIC_LEDGER</span>
                <span style={{ color: '#10b981', fontWeight: 900 }}>SYNCED</span>
              </div>
            </div>
          </SpotlightCard>

          {/* LIVE TRAP MONITOR */}
          <SpotlightCard glowColor="orange" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Zap size={18} color="#f59e0b" />
              <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#fff' }}>LIVE_TRAP_MONITOR</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto' }}>
              {trapLogs.length > 0 ? trapLogs.map((log) => (
                <div key={log.id} style={{ padding: '0.75rem', background: 'rgba(245,158,11,0.05)', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: 900 }}>CAPTURED_NODE</span>
                    <span style={{ color: '#555', fontSize: '0.65rem' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#fff', fontFamily: 'monospace' }}>IP: {log.ip}</div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#444', fontSize: '0.75rem' }}>
                  Awaiting adversarial activity...
                </div>
              )}
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
};

const ThreatIntel = () => (
  <ErrorBoundary>
    <ThreatIntelInner />
  </ErrorBoundary>
);

export default ThreatIntel;
