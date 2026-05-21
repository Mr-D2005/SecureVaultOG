import { motion } from 'framer-motion';
import {
  Activity,
  CheckCircle2,
  Cpu,
  Download,
  FileArchive,
  FileAudio, FileVideo,
  Image as ImageIcon,
  Lock,
  Radio,
  ShieldAlert,
  ShieldCheck,
  ShieldEllipsis,
  Type,
  Upload,
  Wifi,
  Zap
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { pecTransmit, startEntropyCollection, pecEncode } from '../utils/pec_algorithm';
import { KineticButton } from '../components/animations/KineticButton';
import { SpotlightCard } from '../components/ui/SpotlightCard';

const SparklingDust = () => {
  const canvasRef = useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    const particles = Array.from({ length: 130 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.02,
      color: Math.random() > 0.8 ? '#4080ff' : '#00dcb4'
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        p.pulse += p.pulseSpeed;
        const opacity = 0.35 + Math.max(0, Math.sin(p.pulse) * 0.6);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color === '#4080ff' ? `rgba(64, 128, 255, ${opacity})` : `rgba(0, 220, 180, ${opacity})`;
        ctx.fill();
        if (i % 25 === 0 && opacity > 0.7) {
          const next = particles[(i + 1) % particles.length];
          const dist = Math.hypot(p.x - next.x, p.y - next.y);
          if (dist < 150) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(next.x, next.y);
            ctx.strokeStyle = `rgba(0, 220, 180, ${opacity * 0.15})`; ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.6, borderRadius: 'inherit' }} />;
};

const Steganography = () => {
  // ── Existing Image Stego State ──────────────────────────────────────────
  const [carrierFile, setCarrierFile] = useState(null);
  const [payloadMode, setPayloadMode] = useState('text');
  const [payloadText, setPayloadText] = useState('');
  const [payloadFile, setPayloadFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragOverCarrier, setDragOverCarrier] = useState(false);
  const [dragOverPayload, setDragOverPayload] = useState(false);
  const carrierRef = useRef(null);
  const payloadRef = useRef(null);

  // ── Page Tab State ───────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('image'); // 'image' | 'network'

  // ── PEC Network Stego State ──────────────────────────────────────────────
  const [pecSecret, setPecSecret] = useState('');
  const [pecStatus, setPecStatus] = useState('idle'); // idle | encoding | transmitting | success | error
  const [pecEtagPreview, setPecEtagPreview] = useState('');
  const [pecResult, setPecResult] = useState(null);
  const [pecLog, setPecLog] = useState([]);

  // Start collecting mouse entropy for PEC biometric key derivation
  useEffect(() => {
    startEntropyCollection();
  }, []);

  // Live ETag preview as user types
  useEffect(() => {
    if (pecSecret.trim().length > 0) {
      const { etagValue } = pecEncode(pecSecret);
      setPecEtagPreview(etagValue);
    } else {
      setPecEtagPreview('');
    }
  }, [pecSecret]);

  const addLog = (msg, type = 'info') => {
    const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
    setPecLog(prev => [...prev.slice(-6), { msg, type, ts }]);
  };

  const executePecTransmit = async () => {
    if (!pecSecret.trim()) return;
    setPecStatus('encoding');
    setPecResult(null);
    addLog('Deriving biometric entropy key from mouse coordinates...', 'info');
    await new Promise(r => setTimeout(r, 600));

    addLog('Injecting time-drift salt for polymorphic obfuscation...', 'info');
    await new Promise(r => setTimeout(r, 400));

    addLog('Applying XOR cipher — encoding as Apache ETag format...', 'info');
    const { etagValue } = pecEncode(pecSecret);
    setPecEtagPreview(etagValue);
    await new Promise(r => setTimeout(r, 500));

    setPecStatus('transmitting');
    addLog(`Transmitting via GET /api/system/ping [ETag: ${etagValue.substring(0, 22)}...]`, 'warn');

    try {
      const result = await pecTransmit(pecSecret);
      if (result.success) {
        setPecStatus('success');
        setPecResult(result);
        addLog(`[SUCCESS] Server decoded secret: "${result.decoded}"`, 'success');
        addLog(`Salt timestamp recovered: ${result.timestamp}`, 'success');
      } else {
        setPecStatus('error');
        addLog('[WARN] Server received request but PEC decode returned no match.', 'error');
      }
    } catch (e) {
      setPecStatus('error');
      addLog(`[ERROR] Transmission failed: ${e.message}`, 'error');
    }
  };

  const resetAll = () => {
    setCarrierFile(null);
    setPayloadText('');
    setPayloadFile(null);
    setResultUrl(null);
    setErrorMsg('');
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const executeInject = async () => {
    if (!carrierFile) return;
    if (payloadMode === 'text' && !payloadText) return;
    if (payloadMode === 'file' && !payloadFile) return;

    setProcessing(true);
    setErrorMsg('');

    try {
      const carrierBase64 = await fileToBase64(carrierFile);
      let payloadBase64 = null;

      if (payloadMode === 'file') {
        payloadBase64 = await fileToBase64(payloadFile);
      }

      const bodyData = {
        carrierBase64,
        carrierMime: carrierFile.type,
        carrierName: carrierFile.name,
        payloadBase64: payloadBase64,
        payloadName: payloadFile ? payloadFile.name : null,
        payloadText: payloadMode === 'text' ? payloadText : null
      };

      const res = await fetch('/api/stego/inject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.msg || 'Deep-Bind Injection Failed');
      }

      const blob = await res.blob();
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const getMediaIcon = (f, size = 36) => {
    if (!f) return <ImageIcon size={size} opacity={0.5} />;
    if (f.type.startsWith('video/')) return <FileVideo size={size} color="var(--color-primary)" />;
    if (f.type.startsWith('audio/')) return <FileAudio size={size} color="var(--color-primary)" />;
    return <ImageIcon size={size} color="var(--color-primary)" />;
  };

  const fmtSize = (b) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`;

  const logColors = { info: '#7dd3fc', warn: '#fbbf24', error: '#f87171', success: '#4ade80' };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxSizing: 'border-box', background: '#010206' }}>
      <SparklingDust />

      <div style={{ position: 'relative', zIndex: 1, padding: '1rem 2%', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.6rem', flexShrink: 0 }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 900, letterSpacing: '-0.04em' }}>
            🧬 DEEP-BIND <span style={{ color: 'var(--color-primary)' }}>STEGANOGRAPHY</span>
          </h1>
          <p className="text-dim" style={{ fontSize: '0.8rem', fontWeight: 500, margin: 0 }}>
            Losslessly conceal any message or file inside an Image, Video, or Audio carrier — or transmit via a Covert Network Channel.
          </p>
        </header>

        {/* ── TAB SWITCHER ──────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexShrink: 0, width: '90%', maxWidth: '1300px', margin: '0 auto 1rem auto' }}>
          <button
            id="tab-image-stego"
            onClick={() => setActiveTab('image')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1.2rem', borderRadius: '10px', border: '1px solid', borderColor: activeTab === 'image' ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)', background: activeTab === 'image' ? 'rgba(0,220,180,0.1)' : 'rgba(0,0,0,0.3)', color: activeTab === 'image' ? 'var(--color-primary)' : 'rgba(255,255,255,0.5)', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s' }}
          >
            <ImageIcon size={15} /> Image / Audio Stego
          </button>
          <button
            id="tab-network-pec"
            onClick={() => setActiveTab('network')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1.2rem', borderRadius: '10px', border: '1px solid', borderColor: activeTab === 'network' ? '#a78bfa' : 'rgba(255,255,255,0.1)', background: activeTab === 'network' ? 'rgba(167,139,250,0.1)' : 'rgba(0,0,0,0.3)', color: activeTab === 'network' ? '#a78bfa' : 'rgba(255,255,255,0.5)', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s' }}
          >
            <Radio size={15} /> PEC Network Channel
            <span style={{ fontSize: '0.65rem', background: 'rgba(167,139,250,0.2)', color: '#a78bfa', padding: '0.1rem 0.4rem', borderRadius: '6px', border: '1px solid rgba(167,139,250,0.3)' }}>NOVEL</span>
          </button>
        </div>

        {/* ── CONDITIONAL PANELS ───────────────────────────────────────── */}
        {activeTab === 'network' ? (

          /* ══════════════════════════════════════════════════════════════
              PEC — POLYMORPHIC ETAG CLOAKING PANEL
             ══════════════════════════════════════════════════════════════ */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'stretch', width: '90%', maxWidth: '1300px', margin: '0 auto', minHeight: 0, overflow: 'auto' }}>

            {/* LEFT: ENCODER */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(5,5,12,0.85)', backdropFilter: 'blur(40px)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '18px', padding: '1.5rem' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(167,139,250,0.12)', borderRadius: '10px', border: '1px solid rgba(167,139,250,0.25)' }}>
                  <Radio size={18} color="#a78bfa" />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>PEC <span style={{ color: '#a78bfa' }}>Encoder</span></h2>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Polymorphic ETag Cloaking — Application-Layer Steganography</p>
                </div>
              </div>

              {/* Secret Input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Secret Payload (e.g., AWS S3 UUID or any message)</label>
                <textarea
                  id="pec-secret-input"
                  rows={4}
                  placeholder="Enter secret to transmit covertly..."
                  value={pecSecret}
                  onChange={e => setPecSecret(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(167,139,250,0.2)', color: '#fff', padding: '1rem', borderRadius: '10px', resize: 'none', fontFamily: 'monospace', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#a78bfa'}
                  onBlur={e => e.target.style.borderColor = 'rgba(167,139,250,0.2)'}
                />
              </div>

              {/* Live ETag Preview */}
              {pecEtagPreview && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                  <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live ETag Preview (Apache Format)</p>
                  <p id="pec-etag-preview" style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.78rem', color: '#a78bfa', wordBreak: 'break-all', lineHeight: 1.6 }}>{pecEtagPreview}</p>
                </motion.div>
              )}

              {/* Algorithm Info Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                {[
                  { label: 'Format Mimicry', desc: 'Apache ETag', icon: '🎭' },
                  { label: 'Biometric Key', desc: 'Mouse Entropy', icon: '🖱️' },
                  { label: 'Polymorphic', desc: 'Time-Drift Salt', icon: '🌀' },
                ].map(c => (
                  <div key={c.label} style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.12)', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{c.icon}</div>
                    <p style={{ margin: 0, fontSize: '0.62rem', fontWeight: 800, color: '#a78bfa' }}>{c.label}</p>
                    <p style={{ margin: 0, fontSize: '0.58rem', color: 'rgba(255,255,255,0.35)' }}>{c.desc}</p>
                  </div>
                ))}
              </div>

              {/* Transmit Button */}
              <button
                id="pec-transmit-btn"
                onClick={executePecTransmit}
                disabled={!pecSecret.trim() || pecStatus === 'encoding' || pecStatus === 'transmitting'}
                style={{ padding: '1rem', borderRadius: '12px', border: '1px solid rgba(167,139,250,0.4)', background: (!pecSecret.trim() || pecStatus === 'encoding' || pecStatus === 'transmitting') ? 'rgba(255,255,255,0.03)' : 'rgba(167,139,250,0.15)', color: (!pecSecret.trim() || pecStatus === 'encoding' || pecStatus === 'transmitting') ? 'rgba(255,255,255,0.3)' : '#a78bfa', fontWeight: 900, cursor: (!pecSecret.trim() || pecStatus === 'encoding' || pecStatus === 'transmitting') ? 'not-allowed' : 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s', letterSpacing: '0.05em' }}
              >
                {pecStatus === 'encoding' ? <><Cpu size={18} className="icon-spin" /> ENCODING...</> :
                  pecStatus === 'transmitting' ? <><Wifi size={18} className="icon-spin" /> TRANSMITTING...</> :
                  <><Radio size={18} /> TRANSMIT VIA PEC CHANNEL</>}
              </button>

            </div>

            {/* RIGHT: LIVE TERMINAL + RESULT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(5,5,12,0.9)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '1.5rem' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(34,197,94,0.1)', borderRadius: '10px', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <Activity size={18} color="#4ade80" />
                </div>
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>Covert <span style={{ color: '#4ade80' }}>Terminal</span></h2>
              </div>

              {/* Live Log */}
              <div style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1rem', fontFamily: 'monospace', fontSize: '0.75rem', minHeight: '160px', flex: 1, overflowY: 'auto' }}>
                {pecLog.length === 0 ? (
                  <div style={{ color: 'rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.5rem', minHeight: '140px' }}>
                    <Lock size={28} opacity={0.2} />
                    <p style={{ margin: 0 }}>&gt; PEC channel standing by...</p>
                    <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.9 }} style={{ display: 'inline-block', width: 8, height: 14, background: 'rgba(167,139,250,0.4)' }} />
                  </div>
                ) : (
                  pecLog.map((entry, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} style={{ marginBottom: '0.4rem', display: 'flex', gap: '0.5rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>[{entry.ts}]</span>
                      <span style={{ color: logColors[entry.type] || '#fff', wordBreak: 'break-all' }}>{entry.msg}</span>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Result Display */}
              {pecStatus === 'success' && pecResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '12px', padding: '1.1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <ShieldCheck size={20} color="#4ade80" />
                    <span style={{ fontWeight: 900, color: '#4ade80', fontSize: '0.9rem' }}>COVERT TRANSMISSION SUCCESSFUL</span>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: 1.7 }}>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)' }}>Decoded Secret:</p>
                    <p id="pec-decoded-result" style={{ margin: '0.2rem 0 0.75rem 0', color: '#4ade80', fontWeight: 700, wordBreak: 'break-all' }}>{pecResult.decoded}</p>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)' }}>Salt Timestamp:</p>
                    <p style={{ margin: '0.2rem 0 0', color: '#7dd3fc', wordBreak: 'break-all' }}>{pecResult.timestamp}</p>
                  </div>
                </motion.div>
              )}

              {pecStatus === 'error' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <ShieldAlert size={18} color="#f87171" />
                  <span style={{ color: '#f87171', fontWeight: 700, fontSize: '0.85rem' }}>Transmission failed. Check backend is running.</span>
                </motion.div>
              )}

              {/* Network Request Info Box */}
              <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>What the Firewall Sees</p>
                <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>
                  GET /api/system/ping HTTP/1.1<br />
                  <span style={{ color: '#7dd3fc' }}>ETag:</span> W/&quot;3a9f1c-8b2d5e-7c4a1f&quot;<br />
                  <span style={{ color: '#7dd3fc' }}>X-Cache-Seed:</span> 1a2b3c4d<br />
                  Cache-Control: no-cache<br />
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem' }}>← Firewall sees a normal cache-validation request ✓</span>
                </p>
              </div>

            </div>
          </div>

        ) : (

        /* ══════════════════════════════════════════════════════════════
            EXISTING IMAGE / AUDIO STEGO PANEL
           ══════════════════════════════════════════════════════════════ */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'stretch', width: '90%', maxWidth: '1300px', margin: '0 auto', minHeight: 0, overflow: 'auto' }}>

          {/* ── LEFT COLUMN: INJECTION CONFIGURATION ── */}
          <SpotlightCard glowColor="blue" customSize width="100%" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', background: 'rgba(5, 5, 10, 0.85)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)', overflowY: 'visible', flex: 1 }}>

            {/* CARRIER UPLOAD */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.45rem', background: 'rgba(0, 220, 180, 0.1)', borderRadius: '10px', border: '1px solid rgba(0, 220, 180, 0.2)' }}>
                <ShieldEllipsis size={18} color="var(--color-primary)" />
              </div>
              <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, color: '#fff' }}>Step 1: <span style={{ color: 'var(--color-primary)' }}>Carrier</span></h2>
            </div>

            <div
              onDrop={(e) => { e.preventDefault(); setCarrierFile(e.dataTransfer.files[0]); setDragOverCarrier(false); setResultUrl(null); }}
              onDragOver={(e) => { e.preventDefault(); setDragOverCarrier(true); }}
              onDragLeave={() => setDragOverCarrier(false)}
              onClick={() => carrierRef.current.click()}
              style={{
                border: `2px dashed ${dragOverCarrier ? 'var(--color-primary)' : carrierFile ? 'rgba(0,220,180,0.5)' : 'rgba(0,220,180,0.12)'}`,
                padding: '2.5rem 1.5rem', borderRadius: '14px', textAlign: 'center', cursor: 'pointer',
                background: dragOverCarrier ? 'rgba(0,220,180,0.05)' : carrierFile ? 'rgba(0,220,180,0.03)' : 'rgba(0,0,0,0.3)',
                boxShadow: carrierFile ? '0 0 20px rgba(0,220,180,0.08)' : dragOverCarrier ? 'inset 0 0 25px rgba(0,220,180,0.15)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <input type="file" ref={carrierRef} onChange={(e) => { setCarrierFile(e.target.files[0]); setResultUrl(null); }} style={{ display: 'none' }} />
              {carrierFile ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                  {getMediaIcon(carrierFile, 28)}
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontWeight: 900, margin: 0, color: '#fff', fontSize: '0.95rem' }}>{carrierFile.name}</p>
                    <p style={{ color: 'var(--color-primary)', fontSize: '0.75rem', margin: 0, fontFamily: 'monospace', fontWeight: 700 }}>{fmtSize(carrierFile.size)} · STAGED</p>
                  </div>
                </motion.div>
              ) : (
                <div style={{ color: 'var(--color-text-dim)' }}>
                  <Upload size={28} style={{ marginBottom: '0.5rem', opacity: 0.3 }} />
                  <p style={{ fontWeight: 800, margin: '0 0 0.25rem 0', color: '#fff', fontSize: '0.95rem' }}>DROP CARRIER FILE</p>
                  <p style={{ fontSize: '0.7rem', margin: 0, opacity: 0.4 }}>Image · Video · Audio</p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.45rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '10px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                <Lock size={18} color="var(--color-secondary)" />
              </div>
              <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, color: '#fff' }}>Step 2: <span style={{ color: 'var(--color-secondary)' }}>Payload</span></h2>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(0,0,0,0.35)', padding: '0.2rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <button onClick={() => setPayloadMode('text')} style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: 'none', background: payloadMode === 'text' ? 'rgba(168,85,247,0.2)' : 'transparent', color: payloadMode === 'text' ? '#fff' : 'var(--color-text-dim)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.85rem', transition: '0.2s' }}><Type size={13} /> Text</button>
              <button onClick={() => setPayloadMode('file')} style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: 'none', background: payloadMode === 'file' ? 'rgba(168,85,247,0.2)' : 'transparent', color: payloadMode === 'file' ? '#fff' : 'var(--color-text-dim)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.85rem', transition: '0.2s' }}><FileArchive size={13} /> File</button>
            </div>
            {payloadMode === 'text' ? (
              <textarea
                rows={6}
                placeholder="Type the classified message to conceal..."
                value={payloadText}
                onChange={(e) => setPayloadText(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  resize: 'none',
                  fontFamily: 'monospace',
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                  outline: 'none',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-secondary)';
                  e.target.style.boxShadow = 'inset 0 0 20px rgba(0,0,0,0.5), 0 0 10px rgba(168, 85, 247, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.target.style.boxShadow = 'inset 0 0 20px rgba(0,0,0,0.3)';
                }}
              />
            ) : (
              <div
                onDrop={(e) => { e.preventDefault(); setPayloadFile(e.dataTransfer.files[0]); setDragOverPayload(false); }}
                onDragOver={(e) => { e.preventDefault(); setDragOverPayload(true); }}
                onDragLeave={() => setDragOverPayload(false)}
                onClick={() => payloadRef.current.click()}
                style={{ border: `2px dashed ${dragOverPayload ? 'var(--color-secondary)' : payloadFile ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.15)'}`, padding: '1.5rem 1rem', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', background: dragOverPayload ? 'rgba(168,85,247,0.05)' : payloadFile ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)', boxShadow: dragOverPayload ? 'inset 0 0 30px rgba(168,85,247,0.2)' : 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                <input type="file" ref={payloadRef} onChange={(e) => { setPayloadFile(e.target.files[0]); }} style={{ display: 'none' }} />
                {payloadFile ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <FileArchive size={32} color="var(--color-secondary)" />
                    <p style={{ fontWeight: 900, marginBottom: '0.25rem', marginTop: '1rem', color: '#fff' }}>{payloadFile.name}</p>
                    <p style={{ color: 'var(--color-text-dim)', fontSize: '0.8rem', margin: 0 }}>{fmtSize(payloadFile.size)}</p>
                  </motion.div>
                ) : (
                  <div style={{ color: 'var(--color-text-dim)' }}><Upload size={24} style={{ marginBottom: '0.5rem', opacity: 0.5 }} /><p style={{ fontWeight: 800, margin: '0 0 0.5rem 0', color: '#fff' }}>Drop Payload File Here</p></div>
                )}
              </div>
            )}

            {errorMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '1rem', background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', borderRadius: '10px', display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#ef4444', fontWeight: 800 }}>
                <ShieldAlert size={18} /> {errorMsg}
              </motion.div>
            )}

            <KineticButton
              onClick={executeInject}
              disabled={processing || !carrierFile || (payloadMode === 'text' && !payloadText) || (payloadMode === 'file' && !payloadFile)}
              style={{ padding: '1.1rem', fontSize: '1rem', width: '100%', marginTop: '0.5rem', fontWeight: 900 }}
            >
              {processing ? <><Cpu size={20} className="icon-spin" /> BINDING...</> : <><Zap size={20} /> DEEP-BIND & OBFUSCATE</>}
            </KineticButton>
          </SpotlightCard>

          {/* ── RIGHT COLUMN: OUTPUT ── */}
          <SpotlightCard glowColor="green" customSize width="100%" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', background: 'rgba(5, 5, 12, 0.9)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', flex: 1 }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '10px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                  <Download size={20} color="#22c55e" />
                </div>
                <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800, color: '#fff' }}>Output <span style={{ color: '#22c55e' }}>Terminal</span></h2>
              </div>
              {resultUrl && (
                <button onClick={resetAll} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.4rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: '0.2s' }}>↩ Reset</button>
              )}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '15px', background: 'rgba(0,0,0,0.2)', position: 'relative', overflow: 'hidden' }}>

              {!resultUrl && !processing ? (
                <div style={{ opacity: 0.6 }}>
                  <Lock size={48} style={{ marginBottom: '1rem', color: 'var(--color-text-dim)', opacity: 0.5 }} />
                  <p style={{ fontFamily: 'monospace', color: 'var(--color-text-dim)', fontSize: '0.9rem', margin: 0 }}>&gt; Awaiting steganography sequence...</p>
                  <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ width: 10, height: 16, background: 'var(--color-primary)', display: 'inline-block', marginTop: '1rem' }} />
                </div>
              ) : processing ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ marginBottom: '1.5rem' }}>
                    <div style={{ width: '70px', height: '70px', borderRadius: '50%', border: '3px solid transparent', borderTopColor: 'var(--color-primary)', borderRightColor: 'var(--color-primary)', filter: 'drop-shadow(0 0 10px rgba(0, 220, 180, 0.5))' }} />
                  </motion.div>
                  <p style={{ fontFamily: 'monospace', color: 'var(--color-primary)', fontSize: '1.1rem', fontWeight: 900, margin: '0 0 1.5rem 0', letterSpacing: '2px', textShadow: '0 0 10px rgba(0,220,180,0.5)' }}>INJECTING PAYLOAD STREAM</p>
                  <div style={{ width: '100%', maxWidth: '350px', background: 'rgba(255,255,255,0.05)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                    <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2, ease: "linear", repeat: Infinity }} style={{ height: '100%', background: 'var(--color-primary)', boxShadow: '0 0 10px var(--color-primary)' }} />
                  </div>
                  <div style={{ marginTop: '2rem', alignSelf: 'stretch', textAlign: 'left', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '10px', border: '1px outset rgba(255,255,255,0.1)', boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)' }}>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ margin: '0 0 0.5rem 0', fontFamily: 'monospace', fontSize: '0.8rem', color: '#888' }}>&gt; [ALLOCATING CARRIER MATRIX]</motion.p>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={{ margin: '0 0 0.5rem 0', fontFamily: 'monospace', fontSize: '0.8rem', color: '#aaa' }}>&gt; [ENCRYPTING SECRET: AES-256-GCM]</motion.p>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} style={{ margin: '0 0 0.5rem 0', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-secondary)' }}>&gt; [OBFUSCATING DATA TRAIL...]</motion.p>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} style={{ margin: '0', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-primary)' }}>&gt; [DEEP-BINDING MAGIC BYTES...]</motion.p>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 10 }}>
                    <CheckCircle2 size={72} style={{ color: 'var(--color-success)', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 20px rgba(34,197,94,0.6))' }} />
                  </motion.div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.75rem', color: '#fff', textShadow: '0 0 15px rgba(34,197,94,0.3)' }}>Secured Successfully</h3>
                  <p style={{ color: 'var(--color-text-dim)', marginBottom: '2.5rem', fontSize: '1rem', maxWidth: '400px', lineHeight: 1.6 }}>
                    Your payload has been <span style={{ color: 'var(--color-success)' }}>encrypted with AES-256</span> and irreversibly bound to <strong style={{ color: '#fff' }}>{carrierFile.name}</strong>.
                  </p>
                  <KineticButton onClick={() => { const a = document.createElement('a'); a.href = resultUrl; a.download = `secured_${carrierFile.name}`; a.click(); }} style={{ padding: '1.25rem 3.5rem', fontSize: '1.1rem', background: 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(0,0,0,0.5) 100%)', border: '1px solid rgba(34,197,94,0.3)', boxShadow: '0 0 20px rgba(34,197,94,0.1)' }}>
                    <Download size={20} /> Download Secured Media
                  </KineticButton>
                </motion.div>
              )}

            </div>
          </SpotlightCard>
        </div>
        )}
      </div>
    </div>
  );
};

export default Steganography;
