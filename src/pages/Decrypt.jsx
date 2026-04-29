import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LockKeyhole, KeyRound, HardDriveUpload, ShieldCheck, Terminal,
  Fingerprint, Zap, ShieldAlert, FileLock2, BadgeCheck,
  ClipboardCopy, Download, FileLock, Cpu, RefreshCw, ShieldEllipsis,
  Activity, Database, Globe, Key, Wifi, Server
} from 'lucide-react';
import { KineticButton } from '../components/animations/KineticButton';
import { SpotlightCard } from '../components/ui/SpotlightCard';

// ─── ELITE SPARKLING DUST ────────────────────────────────────────────────
const SparklingDust = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
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
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, opacity: 1.0 }} />;
};

const StableNeuralBackground = () => {
  const orbs = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    id: i, size: Math.random() * 320 + 150, x: Math.random() * 100, y: Math.random() * 100,
    duration: Math.random() * 18 + 15, delay: Math.random() * -15,
  })), []);
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      {orbs.map(orb => (
        <motion.div key={orb.id} animate={{ x: [`${orb.x}%`, `${orb.x + (Math.random() * 12 - 6)}%`, `${orb.x}%`], y: [`${orb.y}%`, `${orb.y + (Math.random() * 12 - 6)}%`, `${orb.y}%`], scale: [1, 1.25, 1], opacity: [0.03, 0.07, 0.03] }} transition={{ duration: orb.duration, repeat: Infinity, delay: orb.delay, ease: "linear" }} style={{ position: 'absolute', width: orb.size, height: orb.size, borderRadius: '50%', background: orb.id % 2 === 0 ? 'var(--color-primary)' : '#4080ff', filter: 'blur(100px)', pointerEvents: 'none' }} />
      ))}
      <motion.div animate={{ top: ['-10%', '110%'] }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)', opacity: 0.1, zIndex: 1 }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
    </div>
  );
};

const ScrambledText = ({ text }) => {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(text.split('').map((char, index) => (index < iteration ? text[index] : "01"[Math.floor(Math.random() * 2)])).join(''));
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1;
    }, 35);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{display}</span>;
};

const parsePemKey = (pemContent) => {
  const extract = (tag) => {
    const lines = pemContent.split(/\r?\n/);
    let capturing = false; let result = [];
    for (const line of lines) {
      const clean = line.trim();
      if (clean === `[${tag}]`) { capturing = true; continue; }
      if (capturing) { if (clean.startsWith('[') || clean.startsWith('-----END')) break; if (clean) result.push(clean); }
    }
    return result.join('');
  };
  return {
    sealedKey: extract('SEALED_AES_KEY'), iv: extract('INITIALIZATION_VECTOR'), sealedUrl: extract('SEALED_S3_LINK'),
    kmsPublicKey: extract('KMS_PUBLIC_SIGNATURE'), assetId: extract('ASSET_ID'),
    assetName: pemContent.match(/# Asset\s*:\s*(.+)/)?.[1] || 'Designated Ciphertext',
  };
};

const Decrypt = () => {
  const [pemFileName, setPemFileName] = useState('');
  const [parsedMeta, setParsedMeta] = useState(null);
  const [decryptedText, setDecryptedText] = useState('');
  const [decryptedFileUrl, setDecryptedFileUrl] = useState(null);
  const [decryptedFileName, setDecryptedFileName] = useState('');
  const [phase, setPhase] = useState('idle');
  const [unsealStep, setUnsealStep] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [autoClearTimer, setAutoClearTimer] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const pending = localStorage.getItem('sv_pending_decrypt');
    if (pending) {
      try {
        const p = JSON.parse(pending);
        setParsedMeta({ sealedUrl: p.ciphertext, sealedKey: p.sealedKey, iv: p.iv, assetId: p.assetId || null, assetName: p.assetName || 'Remote Ledger Asset' });
        setPhase('ready'); localStorage.removeItem('sv_pending_decrypt');
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    let interval; if (autoClearTimer > 0) interval = setInterval(() => { setAutoClearTimer(prev => { if (prev <= 1) handleReset(); return prev - 1; }); }, 1000);
    return () => clearInterval(interval);
  }, [autoClearTimer]);

  const handleReset = () => {
    setPemFileName(''); setParsedMeta(null); setDecryptedText(''); setDecryptedFileUrl(null); setDecryptedFileName('');
    setPhase('idle'); setErrorMsg(''); setCopied(false); setAutoClearTimer(0);
  };

  const handleFileLoad = (file) => {
    if (!file || !file.name.endsWith('.pem')) { setErrorMsg('Protocol Refused — Signature Missing'); setPhase('error'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const meta = parsePemKey(ev.target.result);
      if (!meta.sealedKey || !meta.iv) { setErrorMsg('Signature Verification Failure'); setPhase('error'); return; }
      setPemFileName(file.name); setParsedMeta(meta); setPhase('ready');
    };
    reader.readAsText(file);
  };

  const handleDecrypt = async () => {
    if (!parsedMeta || phase === 'unsealing') return;
    setPhase('unsealing');
    const steps = [
      'RSA_2048 Handshake...',
      'KMS Auth Sequence...',
      'Shielded Uplink Established...',
      'Ciphertext Streaming...',
      'Finalizing HMAC Verification...'
    ];
    let i = 0;
    const interval = setInterval(() => { if (i < steps.length) setUnsealStep(steps[i++]); }, 1000);
    try {
      const res = await fetch('/api/encrypt/unseal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sealedUrl: parsedMeta.sealedUrl, sealedKey: parsedMeta.sealedKey, iv: parsedMeta.iv }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Gateway Rejection — Breach Detected');
      clearInterval(interval);
      if (data.decryptedData && data.decryptedData.startsWith('data:')) {
        setDecryptedFileUrl(data.decryptedData); setDecryptedFileName(parsedMeta.assetName || 'recovered_asset');
      } else {
        setDecryptedText(data.decryptedData);
      }
      setTimeout(() => { setPhase('done'); setAutoClearTimer(120); }, 1500);
    } catch (err) { clearInterval(interval); setErrorMsg(err.message); setPhase('error'); }
  };

  return (
    <div style={{ minHeight: '100%', height: '100vh', width: '100%', position: 'relative', overflow: 'hidden', background: '#010101', color: '#fff', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', alignItems: 'center', justifyContent: 'center' }}>

      <StableNeuralBackground />
      <SparklingDust />

      {/* TECHNICAL OVERLAY METADATA */}
      <div style={{ position: 'absolute', top: 20, right: 30, textAlign: 'right', opacity: 0.4, fontSize: '0.7rem', fontFamily: 'monospace', zIndex: 10 }}>
        <p style={{ margin: 0 }}>LATENCY: 14.2ms</p>
        <p style={{ margin: 0 }}>BUFFER_RATE: 1024kb/s</p>
        <p style={{ margin: 0, color: 'var(--color-primary)' }}>SECURE_UP_ACTIVE</p>
      </div>
      <div style={{ position: 'absolute', bottom: 20, left: 30, opacity: 0.4, fontSize: '0.7rem', fontFamily: 'monospace', zIndex: 10 }}>
        <p style={{ margin: 0 }}>CHANNEL_ID: 0x8891...B2</p>
        <p style={{ margin: 0 }}>REGION: US-WEST-2</p>
      </div>

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem' }}>

        {/* COMPACT ELITE HEADER */}
        <motion.header initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <motion.div animate={{ rotateY: [0, 360] }} transition={{ repeat: Infinity, duration: 8, ease: 'linear' }} style={{ color: 'var(--color-primary)', flexShrink: 0 }}>
              <Fingerprint size={40} style={{ filter: 'drop-shadow(0 0 10px var(--color-primary))' }} />
            </motion.div>
            <div>
              <h1 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '0.04em', textShadow: '0 0 15px rgba(0,220,180,0.2)' }}>⚡ Vault Unseal Gateway</h1>
              <p className="text-dim" style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>RSA MASTER-LINK · SECURE DECLASSIFICATION</p>
            </div>
          </div>
        </motion.header>

        {/* COMPACT ELITE STATUS BAR */}
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <SpotlightCard glowColor="orange" customSize width="100%" style={{ padding: 0 }}>
            <div style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '3px solid var(--color-primary)', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Server size={18} style={{ color: 'var(--color-primary)' }} />
                <p style={{ margin: 0, fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.05em' }}>AWS KMS CIPHER CORE — ONLINE</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)' }} /> IN_TRANSIT
              </div>
            </div>
          </SpotlightCard>
        </motion.div>

        <SpotlightCard glowColor={phase === 'done' ? 'green' : phase === 'unsealing' ? 'blue' : 'gray'} customSize width="100%">
          <div style={{ background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(60px)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', padding: '2.5rem 2rem', position: 'relative', minHeight: '340px' }}>
            <AnimatePresence>
              {phase === 'done' && (
                <motion.div initial={{ scale: 0, opacity: 1 }} animate={{ scale: 6, opacity: 0 }} transition={{ duration: 1.2, ease: 'easeOut' }} style={{ position: 'absolute', top: '50%', left: '50%', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, var(--color-primary), transparent)', transform: 'translate(-50%, -50%)', zIndex: 10, pointerEvents: 'none' }} />
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {phase === 'idle' || phase === 'error' ? (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div onClick={() => fileInputRef.current.click()} onDrop={(e) => { e.preventDefault(); handleFileLoad(e.dataTransfer.files[0]); }} onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} style={{ padding: '4.5rem 1.5rem', border: '1px dashed rgba(0,220,180,0.3)', borderRadius: '1.25rem', textAlign: 'center', cursor: 'pointer', background: dragOver ? 'rgba(0,220,180,0.04)' : 'transparent', transition: '0.3s' }}>
                    <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={(e) => handleFileLoad(e.target.files[0])} />
                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 4 }}><FileLock2 size={65} color="var(--color-primary)" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 15px rgba(0,220,180,0.5))' }} /></motion.div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.25rem' }}>Authenticate Master-Link</h2>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>Inject Security Signature (.pem)</p>
                  </div>
                  {phase === 'error' && <div style={{ marginTop: '1.5rem', padding: '0.8rem', background: 'rgba(239,68,68,0.1)', borderRadius: '10px', color: '#ef4444', display: 'flex', gap: '0.75rem', alignItems: 'center', fontWeight: 700, fontSize: '0.8rem' }}><ShieldAlert size={18} /> CRITICAL_FAULT: {errorMsg}</div>}
                </motion.div>
              ) : phase === 'ready' ? (
                <motion.div key="ready" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                  <div style={{ background: 'rgba(0,220,180,0.05)', padding: '2rem', borderRadius: '1.25rem', border: '1px solid var(--color-primary)', marginBottom: '2.5rem', textAlign: 'center' }}>
                    <Fingerprint size={56} color="var(--color-primary)" style={{ marginBottom: '0.75rem' }} /><h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: 0, letterSpacing: '0.05em' }}>Uplink Validated</h3><p style={{ color: 'var(--color-primary)', fontSize: '1.1rem', margin: '0.25rem 0 0', fontWeight: 800 }}>{parsedMeta.assetName}</p>
                  </div>
                  <KineticButton onClick={handleDecrypt} style={{ width: '100%', padding: '1.3rem', fontSize: '1.2rem', fontWeight: 900 }}>EXECUTE RECONSTITUTION</KineticButton>
                </motion.div>
              ) : phase === 'unsealing' ? (
                <div style={{ textAlign: 'center', padding: '4.5rem 0' }}>
                  <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ rotate: { repeat: Infinity, duration: 1.2, ease: "linear" }, scale: { repeat: Infinity, duration: 2 } }} style={{ width: 80, height: 80, border: '5px solid var(--color-primary)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 2rem', boxShadow: '0 0 20px rgba(0,220,180,0.2)' }} />
                  <p style={{ letterSpacing: '0.4em', color: 'var(--color-primary)', fontWeight: 900, fontSize: '1rem' }}>{unsealStep}</p>
                </div>
              ) : phase === 'done' ? (
                <motion.div key="done" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><BadgeCheck size={48} color="#22c55e" /><div><h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, color: '#22c55e' }}>Link Decrypted</h2><p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: '0.25rem 0 0', fontWeight: 700 }}>PAYLOAD EXFILTRATED</p></div></div>
                    <div style={{ padding: '0.6rem 1.2rem', borderRadius: '12px', background: 'rgba(255,236,64,0.1)', border: '1px solid #ffec40', color: '#ffec40', fontWeight: 900, fontSize: '1rem' }}>PURGE {autoClearTimer}S</div>
                  </div>
                  {decryptedFileUrl ? (
                    <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} style={{ padding: '2.5rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1.25rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <HardDriveUpload size={64} color="var(--color-primary)" style={{ marginBottom: '1.5rem' }} /><h4 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '2rem' }}>{decryptedFileName}</h4><KineticButton onClick={() => { const a = document.createElement('a'); a.href = decryptedFileUrl; a.download = decryptedFileName; a.click(); }} style={{ padding: '1rem 4rem' }}>EXFILTRATE PAYLOAD</KineticButton>
                    </motion.div>
                  ) : (
                    <div style={{ background: 'rgba(0,0,0,0.95)', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid var(--color-primary)', fontFamily: 'monospace', fontSize: '1.4rem', position: 'relative', wordBreak: 'break-all', color: 'var(--color-primary)', borderLeft: '10px solid var(--color-primary)', minHeight: '120px', display: 'flex', alignItems: 'center' }}>
                      <button onClick={() => { navigator.clipboard.writeText(decryptedText); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ position: 'absolute', top: 12, right: 12, background: 'var(--color-primary)', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', color: '#000', fontWeight: 800, cursor: 'pointer', fontSize: '0.75rem' }}>{copied ? 'EXTRACTED' : 'SECURE_COPY'}</button>
                      <ScrambledText text={decryptedText} />
                    </div>
                  )}
                  <button onClick={handleReset} style={{ width: '100%', marginTop: '2.5rem', padding: '1.25rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '15px', cursor: 'pointer', fontWeight: 900, fontSize: '0.9rem' }}>NEUTRALIZE SESSION</button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default Decrypt;
