import { motion } from 'framer-motion';
import {
  Activity,
  Cpu,
  Lock,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Wifi,
  Zap,
  RefreshCw,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { pecTransmit, startEntropyCollection, pecEncode } from '../utils/pec_algorithm';

/* ─── Animated Background ──────────────────────────────────────────────────── */
const GridBackground = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);

    const COLS = 40, ROWS = 25;
    const CW = W / COLS, CH = H / ROWS;
    const cells = Array.from({ length: COLS * ROWS }, () => ({ pulse: Math.random() * Math.PI * 2, speed: 0.01 + Math.random() * 0.015 }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      cells.forEach((c, i) => {
        c.pulse += c.speed;
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const opacity = 0.02 + Math.max(0, Math.sin(c.pulse)) * 0.06;
        ctx.strokeStyle = `rgba(167,139,250,${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(col * CW, row * CH, CW, CH);
      });

      // Floating data streams
      const t = Date.now() / 1000;
      for (let s = 0; s < 5; s++) {
        const x = ((s * 0.23 + t * 0.04) % 1) * W;
        const alpha = 0.08 + Math.sin(t + s) * 0.05;
        const grad = ctx.createLinearGradient(x, 0, x, H);
        grad.addColorStop(0, `rgba(167,139,250,0)`);
        grad.addColorStop(0.4, `rgba(167,139,250,${alpha})`);
        grad.addColorStop(1, `rgba(167,139,250,0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(x, 0, 1.5, H);
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />;
};

/* ─── Step Badge ────────────────────────────────────────────────────────────── */
const StepBadge = ({ n, label, active, done }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    <div style={{
      width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 900, fontSize: '0.75rem', flexShrink: 0,
      background: done ? 'rgba(74,222,128,0.2)' : active ? 'rgba(167,139,250,0.25)' : 'rgba(255,255,255,0.05)',
      border: `1.5px solid ${done ? '#4ade80' : active ? '#a78bfa' : 'rgba(255,255,255,0.1)'}`,
      color: done ? '#4ade80' : active ? '#a78bfa' : 'rgba(255,255,255,0.3)',
      transition: 'all 0.4s',
    }}>{done ? '✓' : n}</div>
    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: done ? '#4ade80' : active ? '#a78bfa' : 'rgba(255,255,255,0.3)', transition: 'color 0.4s' }}>{label}</span>
  </div>
);

const LOG_COLORS = { info: '#7dd3fc', warn: '#fbbf24', error: '#f87171', success: '#4ade80' };

/* ─── MAIN PAGE ─────────────────────────────────────────────────────────────── */
const CovertChannel = () => {
  const [secret, setSecret] = useState('');
  const [status, setStatus] = useState('idle'); // idle | encoding | transmitting | success | error
  const [etagPreview, setEtagPreview] = useState('');
  const [result, setResult] = useState(null);
  const [log, setLog] = useState([]);
  const [step, setStep] = useState(0); // 0=idle 1=entropy 2=salt 3=cipher 4=transmit 5=done
  const logEndRef = useRef(null);

  useEffect(() => { startEntropyCollection(); }, []);

  useEffect(() => {
    if (secret.trim()) {
      const { etagValue } = pecEncode(secret);
      setEtagPreview(etagValue);
    } else {
      setEtagPreview('');
    }
  }, [secret]);

  useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [log]);

  const addLog = (msg, type = 'info') => {
    const ts = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLog(prev => [...prev, { msg, type, ts }]);
  };

  const pause = (ms) => new Promise(r => setTimeout(r, ms));

  const reset = () => {
    setStatus('idle'); setResult(null); setLog([]); setStep(0); setEtagPreview('');
  };

  const transmit = async () => {
    if (!secret.trim()) return;
    setLog([]); setResult(null); setStatus('encoding'); setStep(1);

    addLog('▶ PEC ALGORITHM INITIATED', 'info');
    addLog('─────────────────────────────────────', 'info');
    addLog('[ STEP 1 ] Sampling mouse movement entropy buffer...', 'info');
    await pause(700);
    addLog('  Mouse Entropy: [X₁,Y₁] [X₂,Y₂] [X₃,Y₃] → Biometric Key Derived ✓', 'success');

    await pause(300); setStep(2);
    addLog('[ STEP 2 ] Injecting time-drift salt for polymorphic obfuscation...', 'info');
    await pause(600);
    const now = Date.now();
    addLog(`  Salt injected → |PEC:${now}`, 'warn');

    await pause(300); setStep(3);
    addLog('[ STEP 3 ] Applying XOR cipher with biometric key...', 'info');
    await pause(600);
    addLog('  XOR complete → ciphertext bytes generated ✓', 'success');
    addLog('[ STEP 3b ] Formatting as Apache weak ETag structure...', 'info');
    const { etagValue } = pecEncode(secret);
    setEtagPreview(etagValue);
    await pause(500);
    addLog(`  ETag formatted → ${etagValue.substring(0, 36)}...`, 'warn');

    await pause(300); setStep(4); setStatus('transmitting');
    addLog('─────────────────────────────────────', 'info');
    addLog('[ STEP 4 ] Transmitting via GET /api/system/ping ...', 'warn');
    addLog('  Header: ETag: ' + etagValue.substring(0, 28) + '...', 'warn');
    addLog('  Header: X-Cache-Seed: [biometric_key_hex]', 'warn');
    addLog('  Header: Cache-Control: no-cache', 'info');
    addLog('  ◈ Firewall sees: normal cache validation request ✓', 'success');
    await pause(400);

    try {
      const res = await pecTransmit(secret);
      await pause(300);
      if (res.success) {
        setStep(5); setStatus('success'); setResult(res);
        addLog('─────────────────────────────────────', 'info');
        addLog('[ SERVER ] PEC covert transmission INTERCEPTED ✓', 'success');
        addLog(`[ SERVER ] Decoded secret → "${res.decoded}"`, 'success');
        addLog(`[ SERVER ] Salt timestamp → ${res.timestamp}`, 'success');
        addLog('▶ TRANSMISSION COMPLETE — CHANNEL CLOSED', 'success');
      } else {
        setStep(0); setStatus('error');
        addLog('[ ERROR ] Server decode failed — check backend connection.', 'error');
      }
    } catch (e) {
      setStep(0); setStatus('error');
      addLog(`[ ERROR ] Network exception: ${e.message}`, 'error');
    }
  };

  const stepsDone = (n) => step > n;
  const stepActive = (n) => step === n;

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #06010f 0%, #0b0118 50%, #02060f 100%)' }}>
      <GridBackground />

      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '1.5rem 2rem' }}>

        {/* ── HEADER ── */}
        <header style={{ marginBottom: '1.5rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                <div style={{ padding: '0.55rem', background: 'rgba(167,139,250,0.15)', borderRadius: '12px', border: '1px solid rgba(167,139,250,0.3)', boxShadow: '0 0 20px rgba(167,139,250,0.2)' }}>
                  <Radio size={22} color="#a78bfa" />
                </div>
                <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em' }}>
                  PEC <span style={{ color: '#a78bfa' }}>Covert Channel</span>
                </h1>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, background: 'linear-gradient(135deg, rgba(167,139,250,0.25), rgba(167,139,250,0.1))', color: '#a78bfa', padding: '0.25rem 0.65rem', borderRadius: '20px', border: '1px solid rgba(167,139,250,0.35)', letterSpacing: '0.08em' }}>NOVEL ALGO</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                Polymorphic ETag Cloaking — Application-Layer Steganography via HTTP Headers
              </p>
            </div>

            {/* Step Progress */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end' }}>
              <StepBadge n={1} label="Entropy Seeding"   active={stepActive(1)} done={stepsDone(1)} />
              <StepBadge n={2} label="Time-Drift Salt"   active={stepActive(2)} done={stepsDone(2)} />
              <StepBadge n={3} label="XOR + ETag Format" active={stepActive(3)} done={stepsDone(3)} />
              <StepBadge n={4} label="Covert Transmit"   active={stepActive(4)} done={stepsDone(4)} />
            </div>
          </div>
        </header>

        {/* ── MAIN GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '1.25rem', flex: 1, minHeight: 0 }}>

          {/* ─── LEFT: ENCODER PANEL ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(10,5,20,0.85)', backdropFilter: 'blur(40px)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '20px', padding: '1.5rem', overflowY: 'auto' }}>

            {/* Title */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem' }}>
              <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: '#a78bfa', letterSpacing: '0.05em', textTransform: 'uppercase' }}>① Payload Configuration</h2>
            </div>

            {/* Secret Input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', marginBottom: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Secret Payload
              </label>
              <textarea
                id="pec-secret-input"
                rows={5}
                placeholder="Enter secret message or AWS S3 UUID to transmit covertly..."
                value={secret}
                onChange={e => setSecret(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(167,139,250,0.18)', color: '#fff', padding: '1rem', borderRadius: '12px', resize: 'none', fontFamily: 'monospace', fontSize: '0.88rem', outline: 'none', lineHeight: 1.6, transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'rgba(167,139,250,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(167,139,250,0.18)'}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem' }}>
                <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)' }}>{secret.length} chars</span>
                {secret && <span style={{ fontSize: '0.68rem', color: '#4ade80' }}>✓ payload ready</span>}
              </div>
            </div>

            {/* Algorithm feature cards */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', marginBottom: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                PEC Algorithm Properties
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { icon: '🎭', title: 'Format Mimicry', desc: 'Output matches Apache weak ETag spec exactly: W/"inode-size-mtime"', color: '#a78bfa' },
                  { icon: '🖱️', title: 'Biometric Entropy Key', desc: 'XOR key derived dynamically from last 3 mouse coordinates — never stored', color: '#7dd3fc' },
                  { icon: '🌀', title: 'Polymorphic Salting', desc: 'Millisecond timestamp salt ensures unique ciphertext every transmission', color: '#fbbf24' },
                  { icon: '👻', title: 'Fileless Covert Channel', desc: 'Secret never touches disk — lives only in RAM during HTTP transit', color: '#4ade80' },
                ].map(f => (
                  <div key={f.title} style={{ display: 'flex', gap: '0.75rem', padding: '0.7rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{f.icon}</span>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: f.color }}>{f.title}</p>
                      <p style={{ margin: '0.15rem 0 0', fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live ETag Preview */}
            {etagPreview && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                <p style={{ margin: '0 0 0.4rem', fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live ETag Output Preview</p>
                <p id="pec-etag-preview" style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.72rem', color: '#a78bfa', wordBreak: 'break-all', lineHeight: 1.7 }}>{etagPreview}</p>
              </motion.div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: 'auto' }}>
              <button
                id="pec-transmit-btn"
                onClick={transmit}
                disabled={!secret.trim() || status === 'encoding' || status === 'transmitting'}
                style={{
                  flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid',
                  borderColor: (!secret.trim() || status === 'encoding' || status === 'transmitting') ? 'rgba(255,255,255,0.08)' : 'rgba(167,139,250,0.5)',
                  background: (!secret.trim() || status === 'encoding' || status === 'transmitting') ? 'rgba(255,255,255,0.03)' : 'rgba(167,139,250,0.18)',
                  color: (!secret.trim() || status === 'encoding' || status === 'transmitting') ? 'rgba(255,255,255,0.25)' : '#a78bfa',
                  fontWeight: 900, cursor: (!secret.trim() || status === 'encoding' || status === 'transmitting') ? 'not-allowed' : 'pointer',
                  fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s',
                  boxShadow: (!secret.trim() || status === 'encoding' || status === 'transmitting') ? 'none' : '0 0 20px rgba(167,139,250,0.15)',
                }}
              >
                {status === 'encoding'     ? <><Cpu  size={16} className="icon-spin" /> ENCODING...</>
                : status === 'transmitting' ? <><Wifi size={16} className="icon-spin" /> TRANSMITTING...</>
                : <><Radio size={16} /> EXECUTE PEC TRANSMIT</>}
              </button>
              {status !== 'idle' && (
                <button onClick={reset} title="Reset" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: '0.2s' }}>
                  <RefreshCw size={16} />
                </button>
              )}
            </div>
          </div>

          {/* ─── RIGHT: TERMINAL + RESULT ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 0 }}>

            {/* Terminal */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(2,2,8,0.92)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden', minHeight: 0 }}>
              {/* Terminal bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
                <span style={{ marginLeft: '0.5rem', fontSize: '0.72rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>pec_covert_channel.log — live</span>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Activity size={12} color={status === 'transmitting' ? '#4ade80' : 'rgba(255,255,255,0.2)'} />
                  <span style={{ fontSize: '0.65rem', color: status === 'transmitting' ? '#4ade80' : 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>
                    {status === 'transmitting' ? 'LIVE' : status === 'success' ? 'DONE' : 'STANDBY'}
                  </span>
                </div>
              </div>

              {/* Log output */}
              <div style={{ flex: 1, padding: '1rem 1.25rem', fontFamily: 'monospace', fontSize: '0.75rem', lineHeight: 1.9, overflowY: 'auto', minHeight: 0 }}>
                {log.length === 0 ? (
                  <div style={{ color: 'rgba(255,255,255,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.75rem' }}>
                    <Lock size={36} opacity={0.15} />
                    <span>&gt; PEC covert channel standing by...</span>
                    <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.9 }} style={{ display: 'inline-block', width: 8, height: 16, background: 'rgba(167,139,250,0.4)' }} />
                  </div>
                ) : (
                  log.map((entry, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', gap: '1rem', marginBottom: '0.1rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0, minWidth: '7ch' }}>{entry.ts}</span>
                      <span style={{ color: LOG_COLORS[entry.type] || '#fff', wordBreak: 'break-all' }}>{entry.msg}</span>
                    </motion.div>
                  ))
                )}
                <div ref={logEndRef} />
              </div>
            </div>

            {/* Result card */}
            {status === 'success' && result && (
              <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                style={{ background: 'rgba(10,30,15,0.9)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '20px', padding: '1.25rem 1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexShrink: 0, boxShadow: '0 0 40px rgba(74,222,128,0.07)' }}>
                <div style={{ padding: '0.6rem', background: 'rgba(74,222,128,0.12)', borderRadius: '12px', border: '1px solid rgba(74,222,128,0.25)', flexShrink: 0 }}>
                  <ShieldCheck size={24} color="#4ade80" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 0.75rem', fontWeight: 900, color: '#4ade80', fontSize: '0.9rem', letterSpacing: '0.05em' }}>COVERT TRANSMISSION VERIFIED ✓</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '0.75rem' }}>
                      <p style={{ margin: '0 0 0.3rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Decoded Secret</p>
                      <p id="pec-decoded-result" style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.8rem', color: '#4ade80', fontWeight: 700, wordBreak: 'break-all' }}>{result.decoded}</p>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '0.75rem' }}>
                      <p style={{ margin: '0 0 0.3rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Timestamp Salt Recovered</p>
                      <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.8rem', color: '#7dd3fc', wordBreak: 'break-all' }}>{result.timestamp}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(30,5,5,0.9)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '20px', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                <ShieldAlert size={20} color="#f87171" />
                <p style={{ margin: 0, color: '#f87171', fontWeight: 700, fontSize: '0.85rem' }}>Transmission failed. Ensure the backend server is running on port 5001.</p>
              </motion.div>
            )}

            {/* Firewall blindspot info */}
            <div style={{ background: 'rgba(5,5,15,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1rem 1.25rem', flexShrink: 0 }}>
              <p style={{ margin: '0 0 0.6rem', fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={11} /> What the Firewall/Network Monitor Sees
              </p>
              <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.9, background: 'transparent' }}>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>GET</span> /api/system/ping HTTP/1.1{'\n'}
                <span style={{ color: '#7dd3fc' }}>ETag:</span> W/"3a9f1c-8b2d5e-7c4a1f"{'\n'}
                <span style={{ color: '#7dd3fc' }}>X-Cache-Seed:</span> 1a2b3c4d{'\n'}
                Cache-Control: no-cache{'\n'}
                <span style={{ color: '#4ade80' }}>← 100% legitimate cache-validation request ✓</span>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CovertChannel;
