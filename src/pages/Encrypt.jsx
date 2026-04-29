import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
  LockKeyhole, FileLock2, Download, ShieldCheck, BadgeCheck,
  ShieldAlert, Cpu, KeyRound, FileLock, Terminal,
  ClipboardCopy, ScanEye, EyeOff, HardDriveUpload, Wand2, ShieldEllipsis,
  Fingerprint, Server, RefreshCw, FileWarning, Zap
} from 'lucide-react';
import { KineticButton } from '../components/animations/KineticButton';
import { SpotlightCard } from '../components/ui/SpotlightCard';

// ─── Canvas Particle Field ─────────────────────────────────────────────────
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

    const COLORS = ['#00dcb4', '#4080ff', '#a855f7', '#ffffff', '#ff6080', '#ffb830'];
    const particles = Array.from({ length: 180 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2.5 + 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.7 + 0.3,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
    }));

    // Shooting stars state
    const stars = Array.from({ length: 5 }, () => ({
      x: Math.random() * W, y: Math.random() * H * 0.5,
      vx: 3 + Math.random() * 4, vy: 1.5 + Math.random() * 2,
      len: 80 + Math.random() * 120, alpha: 0, life: 0, maxLife: 60 + Math.random() * 60,
      delay: Math.random() * 300,
    }));

    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.clearRect(0, 0, W, H);

      // Network connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,220,180,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        p.pulse += p.pulseSpeed;

        // FIX: Ensure radius and alpha are never negative to prevent Canvas crash
        const r = Math.max(0.1, p.r + Math.sin(p.pulse) * 1.2);
        const a = Math.max(0, p.alpha * (0.6 + Math.sin(p.pulse) * 0.4));

        // Glow using globalAlpha
        ctx.save();
        ctx.globalAlpha = a * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 7, 0, Math.PI * 2);
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 7);
        grd.addColorStop(0, p.color);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.restore();

        // Core dot
        ctx.save();
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      });

      // Shooting stars
      stars.forEach(s => {
        if (s.delay > 0) {
          s.delay--;
        } else {
          s.life++;
          s.x += s.vx; s.y += s.vy;
          const t = Math.min(1, s.life / s.maxLife);
          s.alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? 1 - (t - 0.8) / 0.2 : 1;
          const grd = ctx.createLinearGradient(s.x - s.vx * 10, s.y - s.vy * 10, s.x, s.y);
          grd.addColorStop(0, `rgba(0,220,180,0)`);
          grd.addColorStop(1, `rgba(255,255,255,${Math.max(0, s.alpha * 0.9)})`);
          ctx.beginPath();
          ctx.strokeStyle = grd;
          ctx.lineWidth = 2;
          ctx.moveTo(s.x - s.vx * (s.len / 10), s.y - s.vy * (s.len / 10));
          ctx.lineTo(s.x, s.y);
          ctx.stroke();
          if (s.life >= s.maxLife) {
            s.x = Math.random() * W; s.y = Math.random() * H * 0.5;
            s.vx = 3 + Math.random() * 4; s.vy = 1.5 + Math.random() * 2;
            s.life = 0; s.delay = Math.random() * 200;
          }
        }
      });

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.75 }} />;
};



// ─── Canvas Encryption Overlay ─────────────────────────────────────────────
const EncryptionAnimation = ({ active }) => {
  const canvasRef = useRef(null);
  const hexChars = '0123456789ABCDEF♦♠▲●◆';

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cx = canvas.width / 2, cy = canvas.height / 2;
    let t = 0, animId;

    const draw = () => {
      t += 0.018;
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Matrix hex rain
      for (let col = 0; col < 22; col++) {
        const x = (col / 22) * canvas.width;
        const speed = 1.5 + (col % 3) * 0.8;
        const charY = ((t * speed * 40) + col * 80) % (canvas.height + 40) - 40;
        const char = hexChars[Math.floor(Math.random() * hexChars.length)];
        ctx.font = '14px monospace';
        ctx.fillStyle = col % 3 === 0 ? `rgba(0,220,180,${0.25 + Math.sin(t + col) * 0.1})`
          : col % 3 === 1 ? `rgba(80,120,255,${0.2 + Math.cos(t + col) * 0.08})`
            : `rgba(168,85,247,${0.15 + Math.sin(t * 0.7 + col) * 0.08})`;
        ctx.fillText(char, x, charY);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText(hexChars[Math.floor(Math.random() * hexChars.length)], x, charY - 20);
      }

      // Vortex spinning rings
      const rings = [
        { r: 28, color: '#00dcb4', width: 3, speed: 2.5 },
        { r: 52, color: '#4080ff', width: 2, speed: -1.8, dash: [8, 4] },
        { r: 80, color: '#a855f7', width: 1.5, speed: 1.2, dash: [12, 6] },
        { r: 112, color: '#00dcb4', width: 1, speed: -0.9 },
        { r: 148, color: '#4080ff', width: 1, speed: 0.6, dash: [5, 10] },
        { r: 188, color: '#ff6080', width: 0.8, speed: -0.4 },
        { r: 230, color: '#a855f7', width: 0.5, speed: 0.3, dash: [3, 15] },
      ];
      rings.forEach((ring, i) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * ring.speed);
        ctx.beginPath();
        ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
        const glow = ctx.createLinearGradient(-ring.r, 0, ring.r, 0);
        glow.addColorStop(0, ring.color + '00');
        glow.addColorStop(0.5, ring.color);
        glow.addColorStop(1, ring.color + '00');
        ctx.strokeStyle = glow;
        ctx.lineWidth = ring.width;
        if (ring.dash) ctx.setLineDash(ring.dash); else ctx.setLineDash([]);
        ctx.stroke();
        ctx.shadowColor = ring.color;
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();
      });

      // DNA helix arms
      for (let arm = 0; arm < 2; arm++) {
        const offset = arm * Math.PI;
        ctx.beginPath();
        for (let i = 0; i <= 60; i++) {
          const angle = (i / 60) * Math.PI * 4 + t + offset;
          const r = 100 + Math.sin(i / 60 * Math.PI) * 40;
          const px = cx + Math.cos(angle) * r;
          const py = cy - 160 + (i / 60) * 320;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.strokeStyle = arm === 0 ? 'rgba(0,220,180,0.35)' : 'rgba(80,120,255,0.35)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([]);
        ctx.stroke();
      }
      // DNA rungs
      for (let i = 0; i <= 60; i += 4) {
        const angle = (i / 60) * Math.PI * 4 + t;
        const r = 100 + Math.sin(i / 60 * Math.PI) * 40;
        const x1 = cx + Math.cos(angle) * r;
        const y1 = cy - 160 + (i / 60) * 320;
        const x2 = cx + Math.cos(angle + Math.PI) * r;
        const y2 = cy - 160 + (i / 60) * 320;
        ctx.beginPath();
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(255,255,255,${0.08 + Math.sin(t * 3 + i) * 0.04})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Plasma particle burst
      for (let i = 0; i < 64; i++) {
        const angle = (i / 64) * Math.PI * 2 + t * 0.5;
        const pulseDist = 90 + Math.sin(t * 2 + i * 0.3) * 30;
        const px = cx + Math.cos(angle) * pulseDist;
        const py = cy + Math.sin(angle) * pulseDist;
        const sz = 2 + Math.sin(t * 3 + i) * 1.5;
        const colors = ['#00dcb4', '#4080ff', '#a855f7', '#ffffff', '#ff6080'];
        ctx.beginPath();
        ctx.arc(px, py, sz, 0, Math.PI * 2);
        const c = colors[i % 5];
        ctx.fillStyle = c;
        ctx.shadowColor = c;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Center lock glow
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
      gr.addColorStop(0, `rgba(0,220,180,${0.25 + Math.sin(t * 2) * 0.15})`);
      gr.addColorStop(0.5, `rgba(0,120,255,${0.1 + Math.cos(t) * 0.05})`);
      gr.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, 60, 0, Math.PI * 2);
      ctx.fillStyle = gr;
      ctx.fill();

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}
        >
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

          {/* Overlaid center UI */}
          <motion.div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            {/* Pulsing lock */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], boxShadow: ['0 0 40px rgba(0,220,180,0.6)', '0 0 100px rgba(0,220,180,1)', '0 0 40px rgba(0,220,180,0.6)'] }}
              transition={{ duration: 0.75, repeat: Infinity }}
              style={{ width: 90, height: 90, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,220,180,0.3), rgba(0,10,30,0.95))', border: '2px solid rgba(0,220,180,1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <LockKeyhole size={42} style={{ color: '#00dcb4', filter: 'drop-shadow(0 0 14px #00dcb4) drop-shadow(0 0 6px #fff)' }} />
            </motion.div>

            {/* Scanning bars */}
            {[240, 200, 160].map((w, i) => (
              <motion.div key={i} style={{ width: w, height: i === 0 ? 3 : 2, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden', marginTop: i > 0 ? '-0.6rem' : 0 }}>
                <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 0.65 + i * 0.15, repeat: Infinity, delay: i * 0.1 }}
                  style={{ height: '100%', width: '40%', background: i % 2 === 0 ? 'linear-gradient(90deg,transparent,#00dcb4,#fff,#00dcb4,transparent)' : 'linear-gradient(90deg,transparent,#a855f7,#fff,#a855f7,transparent)', borderRadius: 99 }} />
              </motion.div>
            ))}

            <motion.p animate={{ opacity: [1, 0.2, 1], letterSpacing: ['0.2em', '0.4em', '0.2em'] }} transition={{ duration: 0.7, repeat: Infinity }}
              style={{ color: '#00dcb4', fontSize: '0.9rem', fontFamily: 'monospace', margin: 0, textTransform: 'uppercase', textShadow: '0 0 25px #00dcb4, 0 0 50px rgba(0,220,180,0.5)' }}>
              ⚡ Engaging Cipher Protocol…
            </motion.p>

            <div style={{ display: 'flex', gap: '0.18rem' }}>
              {Array.from({ length: 24 }, (_, i) => (
                <motion.span key={i} animate={{ opacity: [0, 1, 0], color: i % 3 === 0 ? ['#00dcb4', '#fff', '#00dcb4'] : i % 3 === 1 ? ['#a855f7', '#fff', '#a855f7'] : ['#4080ff', '#fff', '#4080ff'] }}
                  transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.04 }}
                  style={{ fontFamily: 'monospace', fontSize: '0.65rem', textShadow: '0 0 8px currentColor' }}>
                  {'0123456789ABCDEF'[Math.floor(Math.random() * 16)]}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};



// ─────────────────────────────────────────
// Main Encrypt Page
// ─────────────────────────────────────────
const Encrypt = () => {
  const [mode, setMode] = useState('message');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle | encrypting | done | error
  const [errorMsg, setErrorMsg] = useState('');
  const [pemKey, setPemKey] = useState('');
  const [assetMeta, setAssetMeta] = useState(null);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (phase === 'encrypting') {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 88) { clearInterval(interval); return 88; }
          return p + Math.random() * 12;
        });
      }, 350);
      return () => clearInterval(interval);
    }
    if (phase === 'done') setProgress(100);
  }, [phase]);

  const onFileSelect = useCallback((f) => {
    if (!f) return;
    setFile(f);
    setPhase('idle');
    setPemKey('');
    setAssetMeta(null);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) onFileSelect(f);
  }, [onFileSelect]);

  const handleEncrypt = async () => {
    if (phase === 'encrypting') return;
    if (mode === 'message' && !message.trim()) return;
    if (mode === 'file' && !file) return;

    setPhase('encrypting');
    setErrorMsg('');
    setPemKey('');
    setAssetMeta(null);

    try {
      let payload, targetName, payloadType;
      if (mode === 'file') {
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        payload = base64;
        targetName = file.name;
        payloadType = 'file';
      } else {
        payload = message;
        targetName = 'Encrypted Message';
        payloadType = 'message';
      }

      const res = await fetch('/api/encrypt/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload, type: payloadType, name: targetName })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details || data.msg || 'Encryption Gateway Refused Payload');
      }

      const timestamp = new Date().toISOString();
      const pem = [
        '-----BEGIN SECUREVAULT MASTER LINK KEY-----',
        `# Generated   : ${timestamp}`,
        `# Asset       : ${targetName}`,
        `# Algorithm   : AES-256-CBC + AWS KMS Envelope Encryption`,
        `# Protocol    : SHIELDED_LINK_v2`,
        '#',
        '# KEEP THIS FILE SECRET — DO NOT SHARE.',
        '',
        '[KMS_PUBLIC_SIGNATURE]',
        data.kmsPublicKey,
        '',
        '[SEALED_S3_LINK]',
        data.sealedUrl,
        '',
        '[SEALED_AES_KEY]',
        data.sealedKey,
        '',
        '[INITIALIZATION_VECTOR]',
        data.iv,
        '',
        '[ASSET_ID]',
        data.assetId,
        '',
        '-----END SECUREVAULT MASTER LINK KEY-----',
      ].join('\n');

      setPemKey(pem);
      setAssetMeta({ assetId: data.assetId, s3_url: data.s3_url, name: targetName });
      setPhase('done');
    } catch (err) {
      console.error('--- [VAULT_SEAL_FAILURE] ---', err);
      // Detailed feedback for the operator
      setErrorMsg(`Vault Seal Refused: ${err.message}`);
      setPhase('error');
    }
  };

  const downloadPem = () => {
    const blob = new Blob([pemKey], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `securevault_key_${Date.now()}.pem`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyPem = () => {
    navigator.clipboard.writeText(pemKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setPhase('idle');
    setMessage('');
    setFile(null);
    setPemKey('');
    setAssetMeta(null);
    setErrorMsg('');
    setProgress(0);
    setShowKey(false);
  };

  const fmtSize = (b) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`;
  const canEncrypt = (mode === 'message' && message.trim()) || (mode === 'file' && file);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '2rem 2.5rem', maxWidth: '900px', margin: '0 auto', boxSizing: 'border-box' }}>
      <SparklingDust />
      <EncryptionAnimation active={phase === 'encrypting'} />

      {/* ── HEADER ───── */}
      <motion.header
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem' }}>
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            style={{ color: 'var(--color-primary)', flexShrink: 0 }}
          >
            <Fingerprint size={42} />
          </motion.div>
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0, fontFamily: 'var(--font-display)', letterSpacing: '0.03em' }}>
              ⚡ Initiate Vault Seal Protocol
            </h1>
            <p className="text-dim" style={{ margin: 0, fontSize: '0.875rem' }}>
              Zero-Trust AES-256 Encryption · KMS Envelope Sealing · Quantum-Hardened S3 Blacksite
            </p>
          </div>
        </div>
      </motion.header>

      {/* ── KMS STATUS BAR ── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        style={{ position: 'relative', zIndex: 1, marginBottom: '1.75rem' }}
      >
        <SpotlightCard glowColor="orange" customSize width="100%" className="card" style={{ padding: 0 }}>
          <div style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '3px solid var(--color-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <KeyRound size={22} style={{ color: 'var(--color-primary)' }} />
              </motion.div>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>AWS KMS Cipher Core &#x2014; ARMED</p>
                <p className="text-dim" style={{ fontSize: '0.7rem', margin: 0, fontFamily: 'monospace' }}>
                  AES-256-CBC · eu-north-1 · Envelope Key Rotation: Active
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <motion.div
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
                style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)', boxShadow: '0 0 8px var(--color-primary)' }}
              />
              Online
            </div>
          </div>
        </SpotlightCard>
      </motion.div>

      {/* ── MODE SWITCHER ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ position: 'relative', zIndex: 1, marginBottom: '1.75rem', display: 'flex', gap: '1rem' }}
      >
        {[
          { id: 'message', icon: <Terminal size={18} />, label: '🔐 Encrypt Transmission' },
          { id: 'file', icon: <FileLock2 size={18} />, label: '🗄️ Encrypt File Asset' },
        ].map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => { setMode(tab.id); reset(); }}
            whileHover={{ scale: 1.03, boxShadow: '0 0 24px rgba(0,220,180,0.18)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              flex: 1, padding: '0.9rem 1.25rem', borderRadius: 'var(--radius-md)',
              border: mode === tab.id ? '1px solid var(--color-primary)' : '1px solid var(--color-outline-variant)',
              background: mode === tab.id ? 'rgba(0,220,180,0.1)' : 'rgba(0,0,0,0.3)',
              color: mode === tab.id ? 'var(--color-primary)' : 'var(--color-text-dim)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '0.6rem', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.25s ease',
              fontFamily: 'var(--font-body)', letterSpacing: '0.03em',
              boxShadow: mode === tab.id ? '0 0 20px rgba(0,220,180,0.12)' : 'none'
            }}
          >
            {tab.icon} {tab.label}
            {mode === tab.id && (
              <motion.div
                layoutId="tab-dot"
                style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)' }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* ── INPUT CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <SpotlightCard glowColor="blue" customSize width="100%" className="card" style={{ marginBottom: '1.5rem' }}>

          <AnimatePresence mode="wait">
            {mode === 'message' ? (
              <motion.div key="msg" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.22 }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <Terminal size={14} className="icon-cyber" />
                    Classified Intel Payload
                    <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>{message.length} bytes</span>
                  </label>
                  <textarea
                    className="input-control"
                    rows={7}
                    placeholder={'INPUT CLASSIFIED PAYLOAD > _ \n\nThis transmission will be AES-256 encrypted and sealed behind an AWS KMS envelope key. Without your .pem key file, this data is unbreakable — even to us.\n\nNo plaintext is stored. No logs. Zero-trust architecture.'}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={phase === 'encrypting'}
                    style={{ resize: 'vertical', background: 'rgba(0,0,0,0.25)', lineHeight: 1.7 }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div key="file" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <ShieldEllipsis size={14} className="icon-cyber" /> Drop File into Secure Enclave
                </label>
                <motion.div
                  onDrop={onDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileInputRef.current?.click()}
                  animate={dragOver ? { scale: 1.02 } : { scale: 1 }}
                  style={{
                    border: `2px dashed ${dragOver ? 'var(--color-primary)' : file ? 'rgba(0,220,180,0.5)' : 'var(--color-outline-variant)'}`,
                    borderRadius: 'var(--radius-md)', padding: '2.5rem 1.5rem',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: '0.75rem', cursor: 'pointer', minHeight: '160px',
                    background: dragOver ? 'rgba(0,220,180,0.06)' : file ? 'rgba(0,220,180,0.03)' : 'rgba(0,0,0,0.2)',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={e => onFileSelect(e.target.files[0])} />
                  {file ? (
                    <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center' }}>
                      <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ repeat: 2, duration: 0.4 }}>
                        <FileLock2 size={42} style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }} />
                      </motion.div>
                      <p style={{ margin: 0, fontWeight: 700, color: 'var(--color-text)', fontSize: '1rem' }}>{file.name}</p>
                      <p className="text-dim" style={{ margin: '0.25rem 0 0', fontSize: '0.8rem' }}>{fmtSize(file.size)} · Click to change</p>
                    </motion.div>
                  ) : (
                    <>
                      <motion.div animate={dragOver ? { y: [-6, 0, -6] } : {}} transition={{ repeat: Infinity, duration: 0.8 }}>
                        <HardDriveUpload size={44} style={{ color: dragOver ? 'var(--color-primary)' : 'var(--color-text-dim)' }} />
                      </motion.div>
                      <p style={{ margin: 0, color: 'var(--color-text-dim)', fontSize: '0.95rem', textAlign: 'center' }}>
                        <strong style={{ color: 'var(--color-primary)' }}>Drag & drop your asset</strong> into the secure enclave
                        <br /><span style={{ fontSize: '0.8rem' }}>or breach the perimeter and browse manually</span>
                      </p>
                      <p className="text-dim" style={{ fontSize: '0.74rem', margin: 0 }}>All threat vectors neutralized — PDF · ZIP · EXE · BIN · Any format</p>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <AnimatePresence>
            {(phase === 'encrypting' || phase === 'done') && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '1.25rem' }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.4rem', color: 'var(--color-text-dim)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {phase === 'encrypting' && <Cpu size={12} className="icon-spin" />}
                    {phase === 'done' && <BadgeCheck size={13} style={{ color: 'var(--color-success)' }} />}
                    {phase === 'encrypting' ? '⚡ Routing payload through KMS cipher core — standby…' : '✓ Payload sealed & locked in S3 blacksite'}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden', position: 'relative' }}>
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: 'easeOut', duration: 0.4 }}
                    style={{ height: '100%', background: phase === 'done' ? 'var(--color-success)' : 'linear-gradient(90deg, var(--color-primary), #0080ff)', borderRadius: '99px', position: 'relative' }}
                  >
                    {phase === 'encrypting' && (
                      <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        style={{ position: 'absolute', right: 0, top: '-3px', width: '12px', height: '12px', borderRadius: '50%', background: 'white', boxShadow: '0 0 8px white' }}
                      />
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {phase === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.875rem' }}
              >
                <ShieldAlert size={17} /> {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Encrypt button */}
          <motion.div style={{ marginTop: '1.5rem' }}>
            <KineticButton
              onClick={phase === 'done' ? reset : handleEncrypt}
              loading={phase === 'encrypting'}
              disabled={(!canEncrypt && phase !== 'done') || phase === 'encrypting'}
              style={{ width: '100%', padding: '1.1rem', fontSize: '1.05rem', letterSpacing: '0.04em' }}
            >
              {phase === 'encrypting' ? (
                <><Cpu size={18} className="icon-spin" /> Engaging Cipher Protocol…</>
              ) : phase === 'done' ? (
                <><Wand2 size={18} /> Encrypt Another Payload</>
              ) : (
                <><LockKeyhole size={18} /> ⚡ Initiate Seal Protocol</>
              )}
            </KineticButton>
          </motion.div>
        </SpotlightCard>
      </motion.div>

      {/* ── SUCCESS PANEL ── */}
      <AnimatePresence>
        {phase === 'done' && assetMeta && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', damping: 22, stiffness: 180 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            {/* Meta info */}
            <SpotlightCard glowColor="green" customSize width="100%" className="card" style={{ marginBottom: '1.25rem', borderColor: 'rgba(34,197,94,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}>
                  <BadgeCheck size={32} style={{ color: 'var(--color-success)' }} />
                </motion.div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-success)' }}>SEAL COMPLETE — Payload Secured in Blacksite</p>
                  <p className="text-dim" style={{ margin: 0, fontSize: '0.8rem' }}>Zero-trust AES-256 encryption applied · KMS key sealed · S3 deposit confirmed</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { label: 'Asset Name', value: assetMeta.name },
                  { label: 'Asset ID', value: assetMeta.assetId?.slice(0, 18) + '…' },
                  { label: 'S3 Location', value: assetMeta.s3_url, full: true },
                ].map((item, i) => (
                  <div key={i} style={{ gridColumn: item.full ? '1/-1' : 'auto', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', border: '1px solid var(--color-outline-variant)' }}>
                    <p className="text-dim" style={{ margin: 0, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.2rem' }}>{item.label}</p>
                    <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all', color: 'var(--color-primary)' }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </SpotlightCard>

            {/* PEM Key */}
            <SpotlightCard glowColor="red" customSize width="100%" className="card" style={{ border: '1px solid rgba(239,68,68,0.35)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <FileWarning size={24} color="#ef4444" />
                  </motion.div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: '#ef4444', fontSize: '1rem' }}>☠ DECRYPTION KEY — EYES ONLY — ONE-TIME DISPLAY</p>
                    <p className="text-dim" style={{ margin: 0, fontSize: '0.78rem' }}>This PEM file is the only vector back into your sealed vault. Exfiltrate it now — it will not be shown again.</p>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.1 }} onClick={() => setShowKey(s => !s)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-dim)', cursor: 'pointer' }}>
                  {showKey ? <EyeOff size={18} /> : <ScanEye size={18} />}
                </motion.button>
              </div>

              <AnimatePresence>
                {showKey && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden', marginBottom: '1.25rem' }}
                  >
                    <pre style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--color-outline-variant)', borderRadius: 'var(--radius-sm)', padding: '1rem', color: 'var(--color-primary)', fontSize: '0.74rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0, maxHeight: '200px', overflowY: 'auto', lineHeight: 1.6 }}>
                      {pemKey}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>

              {!showKey && (
                <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-outline-variant)', borderRadius: 'var(--radius-sm)', textAlign: 'center', color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>
                  <ScanEye size={14} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                  Authorization required — click the eye to declassify key material
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <KineticButton onClick={downloadPem} style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444' }}>
                  <Download size={16} /> Exfiltrate .pem Key
                </KineticButton>
                <KineticButton onClick={copyPem} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-outline-variant)' }}>
                  {copied ? <><BadgeCheck size={16} /> Key Exfiltrated!</> : <><ClipboardCopy size={16} /> Copy Key Material</>}
                </KineticButton>
              </div>

              <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.05)', borderRadius: 'var(--radius-sm)', border: '1px dashed rgba(239,68,68,0.3)' }}>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(239,68,68,0.85)', lineHeight: 1.6 }}>
                  ⚠ SecureVault does NOT store your private key. If this file is lost, the encrypted asset <strong>cannot be recovered</strong>.
                </p>
              </div>
            </SpotlightCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Encrypt;
