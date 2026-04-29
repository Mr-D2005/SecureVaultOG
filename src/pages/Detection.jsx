import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, Cpu, Search, AlertTriangle, CheckCircle2, 
  Database, Shield, Unlock, Download, ShieldAlert,
  FileVideo, FileAudio, Image as ImageIcon, FileArchive,
  BarChart3, Zap, Activity
} from 'lucide-react';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { GlowCardGrid } from '../components/ui/GlowCardGrid';
import { KineticButton } from '../components/animations/KineticButton';

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
    const particles = Array.from({ length: 140 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
      color: Math.random() > 0.6 ? '#4080ff' : '#8b5cf6'
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        p.pulse += p.pulseSpeed;
        const opacity = 0.2 + Math.max(0, Math.sin(p.pulse) * 0.5);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color === '#4080ff' ? `rgba(64,128,255,${opacity})` : `rgba(0,220,180,${opacity})`;
        ctx.fill();
        if (i % 20 === 0 && opacity > 0.5) {
          const next = particles[(i + 1) % particles.length];
          const dist = Math.hypot(p.x - next.x, p.y - next.y);
          if (dist < 120) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(next.x, next.y);
            ctx.strokeStyle = `rgba(0,220,180,${opacity * 0.12})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.85 }} />;
};

const DigitalGlitch = () => {
  const [active, setActive] = useState(false);
  React.useEffect(() => {
    const trigger = () => {
      setActive(true);
      setTimeout(() => setActive(false), 150);
      setTimeout(trigger, 4000 + Math.random() * 8000);
    };
    const t = setTimeout(trigger, 5000);
    return () => clearTimeout(t);
  }, []);

  if (!active) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none', background: 'rgba(64,128,255,0.02)', mixBlendMode: 'overlay' }}>
      <div style={{ position: 'absolute', top: Math.random() * 100 + '%', left: 0, width: '100%', height: '2px', background: 'rgba(64,128,255,0.2)', boxShadow: '0 0 10px rgba(64,128,255,0.5)' }} />
      <div style={{ position: 'absolute', top: Math.random() * 100 + '%', left: 0, width: '100%', height: '1px', background: 'rgba(239,68,68,0.2)' }} />
    </div>
  );
};

const RadarSweep = () => {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '150vw', height: '150vw', borderRadius: '50%', border: '1px solid rgba(64, 128, 255, 0.12)', boxShadow: 'inset 0 0 120px rgba(64,128,255,0.06)' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100vw', height: '100vw', borderRadius: '50%', border: '1px dotted rgba(64, 128, 255, 0.15)' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '50vw', height: '50vw', borderRadius: '50%', border: '1px dashed rgba(64, 128, 255, 0.25)' }} />
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: 'linear' }} style={{ position: 'absolute', top: '50%', left: '50%', width: '150vw', height: '150vw', background: 'conic-gradient(from 0deg, transparent 85%, rgba(64, 128, 255, 0.35) 100%)', transformOrigin: '0 0', filter: 'blur(3px)' }} />
      {/* Dynamic Pulse */}
      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 4 }} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '30vw', height: '30vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(64,128,255,0.15) 0%, transparent 70%)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(64,128,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(64,128,255,0.12) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
    </div>
  );
};

const METHOD_METADATA = {
  'SIGNATURE_SECUREVAULT':      { label: 'SecureVault Deep-Bind (Native)', color: '#ef4444', desc: 'SecureVault magic-byte marker detected. Definitive match.' },
  'STRUCTURAL_ANOMALY_JPEG':    { label: 'JPEG Trailing Stream',      color: '#f97316', desc: 'Binary data found after JPEG EOF (0xFFD9) terminator.' },
  'STRUCTURAL_ANOMALY_PNG':     { label: 'PNG Stream Overload',       color: '#f97316', desc: 'Unexpected data packets detected after PNG IEND chunk.' },
  'STRUCTURAL_ANOMALY_GIF':     { label: 'GIF Footer Padding',        color: '#f97316', desc: 'Unauthorized stream detected after GIF 0x3B footer.' },
  'STRUCTURAL_ANOMALY_MP4':     { label: 'MP4 Free-Box Append',       color: '#f97316', desc: 'Payload found hidden in MP4 free-atom or moov-box padding.' },
  'NEURAL_ENTROPY_PEAK':        { label: 'Shannon Entropy Peak',      color: '#eab308', desc: 'Entropy cluster > 7.95 detected. Non-natural data density.' },
  'BITPLANE_LSB_ANOMALY':       { label: 'Bit-Plane Variance',        color: '#22c55e', desc: 'LSB correlation deviation detected — likely bit-replacement hiding.' },
  'FREQUENCY_SPECTRUM_NOISE':   { label: 'Frequency Noise Floor',     color: '#06b6d4', desc: 'Anomalous high-frequency noise in DCT/FFT domain.' },
  'DEFINITIVE_RECOVERY_TAIL':   { label: 'Plaintext Tail Recovery',   color: '#ec4899', desc: 'Human-readable message extracted from trailing binary stream.' },
  'SEMANTIC_FILE_NAME':         { label: 'Semantic Signal',           color: '#8b5cf6', desc: 'Filename metadata contains steganography-related keywords.' },
  'OPENSTEGO_RANDOM_LSB':       { label: 'OpenStego Signature',       color: '#3b82f6', desc: 'Heuristic match for OpenStego random LSB pattern.' },
  'OUTGUESS_DCT_ANOMALY':       { label: 'OutGuess Matrix Anomaly',   color: '#3b82f6', desc: 'Detected DCT coefficient frequency warp from OutGuess.' },
  'STEGHIDE_AES_HEADER':        { label: 'StegHide Encrypted Header', color: '#ef4444', desc: 'Found AES-encrypted block structure matching StegHide.' },
  'F5_MATRIX_ENCODING':         { label: 'F5 Matrix Pattern',         color: '#a855f7', desc: 'Permutation-based hiding pattern found (F5 Algorithm).' },
  'DSSS_SPREAD_SPECTRUM':       { label: 'DSSS Modulation',           color: '#f43f5e', desc: 'Spread-spectrum noise modulation detected in carrier.' }
};

const NeuralDataFlux = () => {
  const [beams, setBeams] = useState([]);
  React.useEffect(() => {
    const interval = setInterval(() => {
      const newBeam = {
        id: Math.random(),
        type: Math.random() > 0.5 ? 'h' : 'v',
        pos: Math.random() * 100,
        speed: 2 + Math.random() * 4,
        color: Math.random() > 0.5 ? 'rgba(64,128,255,0.9)' : 'rgba(139,92,246,0.8)'
      };
      setBeams(prev => [...prev.slice(-20), newBeam]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {beams.map(beam => (
        <motion.div
          key={beam.id}
          initial={{ opacity: 0, [beam.type === 'h' ? 'top' : 'left']: `${beam.pos}%`, [beam.type === 'h' ? 'left' : 'top']: '-10%' }}
          animate={{ opacity: [0, 1, 0], [beam.type === 'h' ? 'left' : 'top']: '110%' }}
          transition={{ duration: beam.speed, ease: "linear" }}
          style={{
            position: 'absolute',
            width: beam.type === 'h' ? '100px' : '1px',
            height: beam.type === 'h' ? '1px' : '100px',
            background: `linear-gradient(${beam.type === 'h' ? '90deg' : '0deg'}, transparent, ${beam.color}, transparent)`,
            boxShadow: `0 0 15px ${beam.color}`
          }}
        />
      ))}
    </div>
  );
};

const Detection = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 40, y: (e.clientY / window.innerHeight - 0.5) * 40 });
  };
  const [carrierFile, setCarrierFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);
  const [scanLog, setScanLog] = useState([]);

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  const addLog = (msg) => setScanLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleUpload = (file) => {
    setCarrierFile(file);
    setResult(null);
    setScanLog([]);
  };

  const executeExtractionScan = async () => {
    if (!carrierFile) return;
    setScanning(true);
    setResult(null);
    setScanLog([]);

    addLog(`Target Acquired: ${carrierFile.name} (${(carrierFile.size / 1024).toFixed(1)} KB)`);
    addLog('Loading Universal AI Forensic Engine v2.5...');
    addLog('Scanning 100+ Steganographic Patterns...');
    addLog('Calculating Shannon Entropy clusters...');
    addLog('Analyzing Bit-Plane Variance (LSB/DCT)...');

    try {
      const carrierBase64 = await fileToBase64(carrierFile);
      const res = await fetch('/api/stego/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carrierBase64, carrierName: carrierFile.name })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Extraction failed');

      addLog(`Forensic Scan Complete. Confidence: ${data.confidence}%.`);
      if (data.detectedAlgorithm && data.detectedAlgorithm !== 'None') {
        addLog(`MATCH FOUND: ${data.detectedAlgorithm}`);
      } else if (data.stegoSource === 'clean') {
        addLog("No active steganographic signatures detected.");
      }

      setResult({
        status: data.stegoSource === 'clean' ? 'clean' : 'stego',
        stegoSource: data.stegoSource,
        aiAnalysis: data.aiAnalysis,
        confidence: data.confidence,
        heuristics: data.heuristics,
        detectedAlgorithm: data.detectedAlgorithm,
        payloadType: data.type,
        payloadData: data.data,
        payloadName: data.name,
        extractedForeignText: data.extractedForeignText || (data.stegoSource === 'third-party' ? data.data : null)
      });
    } catch (err) {
      addLog(`FORENSIC FAULT: ${err.message}`);
      setResult({ status: 'error', stegoSource: 'error', errorMsg: err.message });
    } finally {
      setScanning(false);
    }
  };

  const handleDownloadFilePayload = () => {
    if (!result?.payloadData) return;
    const bytes = atob(result.payloadData);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    const blob = new Blob([arr]);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = result.payloadName || 'extracted_payload.bin';
    a.click();
  };

  const fmtSize = (b) => b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`;
  const getMediaIcon = (f, size = 40) => {
    if (!f) return <ImageIcon size={size} opacity={0.3} />;
    if (f.type.startsWith('video/')) return <FileVideo size={size} color="var(--color-primary)" />;
    if (f.type.startsWith('audio/')) return <FileAudio size={size} color="var(--color-primary)" />;
    return <ImageIcon size={size} color="var(--color-primary)" />;
  };

  const statusColor = scanning ? '#eab308' : result?.status === 'stego' ? '#ef4444' : result?.status === 'clean' ? '#22c55e' : '#4080ff';

  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        background: '#010206',
        position: 'relative', 
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* VIBRANT BACKGROUND ELEMENTS WITH PARALLAX */}
      <motion.div animate={{ x: mousePos.x * 1.5, y: mousePos.y * 1.5 }} style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(64,128,255,0.35) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }} />
      <motion.div animate={{ x: -mousePos.x * 2, y: -mousePos.y * 2 }} style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)', filter: 'blur(120px)', zIndex: 0 }} />
      <motion.div animate={{ x: mousePos.x, y: -mousePos.y }} style={{ position: 'absolute', top: '30%', right: '10%', width: '30%', height: '30%', background: 'radial-gradient(circle, rgba(0,220,180,0.2) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0 }} />
      
      {/* SCANLINES OVERLAY */}
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(transparent 0px, transparent 1px, rgba(255,255,255,0.02) 2px, transparent 3px)', backgroundSize: '100% 4px', pointerEvents: 'none', zIndex: 5 }} />

      <SparklingDust />
      <RadarSweep />
      <NeuralDataFlux />
      <DigitalGlitch />
      <div style={{ position: 'relative', zIndex: 1, padding: '0.75rem 2%', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* COMMAND HEADER */}
        <header style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
              <Search color="var(--color-primary)" size={36}/> AI FORENSIC <span className="text-neon">LABORATORY</span>
            </h1>
            <p className="text-dim" style={{ fontSize: '1rem', margin: 0, opacity: 0.9, fontWeight: 600, letterSpacing: '0.5px' }}>
              Neural Anomaly Engine v2.5 • <span style={{ color: 'var(--color-primary)' }}>100+ Signatures Active</span>
            </p>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.15)', paddingRight: '2rem' }}>
               <p style={{ fontSize: '0.75rem', color: '#666', margin: '0 0 0.3rem 0', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px' }}>System Load</p>
               <p style={{ fontSize: '1.1rem', color: 'var(--color-primary)', margin: 0, fontWeight: 900, fontFamily: 'monospace' }}>STABLE_98%</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,220,180,0.08)', padding: '0.6rem 1.5rem', borderRadius: '8px', border: '1px solid rgba(0,220,180,0.25)' }}>
              <div className="status-orb" style={{ background: 'var(--color-primary)', width: '10px', height: '10px' }}></div>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 900, letterSpacing: '2px' }}>ENGINE_ONLINE</span>
            </div>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem', flex: 1, alignItems: 'stretch', width: '100%', minHeight: 0, overflow: 'hidden' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflow: 'hidden' }}>
            <SpotlightCard glowColor="purple" style={{ padding: '2rem', background: 'rgba(5, 5, 12, 0.95)', display: 'flex', flexDirection: 'column', flex: 'none', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ fontSize: '1.25rem', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff', fontWeight: 900 }}>
                <Database size={24} color="var(--color-primary)"/> EVIDENCE_DRIVE
              </h3>

              <div 
                onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files[0]); setDragOver(false); }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileRef.current.click()}
                style={{
                  border: `1.5px dashed ${dragOver ? 'var(--color-primary)' : carrierFile ? 'rgba(0,220,180,0.4)' : 'rgba(255,255,255,0.12)'}`,
                  padding: '1.5rem 1rem', borderRadius: '10px', textAlign: 'center', cursor: 'pointer',
                  background: dragOver ? 'rgba(0,220,180,0.05)' : 'rgba(0,0,0,0.5)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', marginBottom: '0.75rem',
                  boxShadow: carrierFile ? 'inset 0 0 20px rgba(0,220,180,0.05)' : 'none'
                }}
              >
                <input type="file" ref={fileRef} onChange={(e) => handleUpload(e.target.files[0])} style={{ display: 'none' }} />
                {carrierFile ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    {getMediaIcon(carrierFile, 64)}
                    <p style={{ fontWeight: 900, margin: '1.25rem 0 0.5rem', color: '#fff', fontSize: '1rem', wordBreak: 'break-all' }}>{carrierFile.name}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>{fmtSize(carrierFile.size)}</p>
                  </motion.div>
                ) : (
                  <div style={{ color: 'var(--color-text-dim)' }}>
                    <Upload size={48} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                    <p style={{ fontSize: '1rem', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '2px' }}>DROP SUSPECT ASSET</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.75rem', opacity: 0.4 }}>IMAGE · VIDEO · AUDIO · BINARY</p>
                  </div>
                )}
              </div>

              <KineticButton onClick={executeExtractionScan} disabled={scanning || !carrierFile} style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', fontWeight: 900 }}>
                {scanning ? <><Cpu size={20} className="icon-spin" /> RUNNING_NEURAL_SWEEP...</> : <><Search size={20} /> INITIATE SCAN</>}
              </KineticButton>
            </SpotlightCard>

            <SpotlightCard glowColor="blue" style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.8)', flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                 <p style={{ fontSize: '0.55rem', color: 'var(--color-primary)', textTransform: 'uppercase', margin: 0, fontWeight: 900, letterSpacing: '1px' }}>Process_Stream_v2.5</p>
                 <Activity size={12} color="var(--color-primary)" style={{ opacity: 0.5 }} />
              </div>
              <div style={{ flex: 1, overflowY: 'auto', fontSize: '0.65rem', paddingRight: '0.25rem' }}>
                {scanLog.length === 0 ? (
                  <p style={{ fontFamily: 'monospace', color: '#444', fontStyle: 'italic' }}>_ Awaiting evidence stream...</p>
                ) : (
                  scanLog.map((l, i) => (
                    <p key={i} style={{ fontFamily: 'monospace', color: i === scanLog.length - 1 ? 'var(--color-primary)' : '#666', margin: '0 0 0.2rem 0', lineHeight: 1.3 }}>
                      <span style={{ opacity: 0.3 }}>{'>'}</span> {l}
                    </p>
                  ))
                )}
              </div>
            </SpotlightCard>
          </div>

          {/* ── RIGHT COLUMN: DETAILED ANALYSIS ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', overflow: 'hidden', width: '100%', flex: 1 }}>
            <SpotlightCard customSize={true} width="auto" glowColor={result?.status === 'stego' ? 'red' : result?.status === 'clean' ? 'green' : 'blue'} style={{ padding: '2rem', background: 'rgba(5, 5, 20, 0.98)', flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', maxWidth: '1000px', minHeight: '600px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '200px' }}>
                <Shield size={32} color={statusColor} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#fff', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Forensic Report</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-dim)' }}>Scan ID: {Math.random().toString(36).substr(2, 6).toUpperCase()} • Neural Node: DX-9</p>
                </div>
              </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'rgba(0,0,0,0.6)', padding: '1rem 2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
                  <div className="status-orb" style={{ background: statusColor, width: '16px', height: '16px', flexShrink: 0, boxShadow: `0 0 25px ${statusColor}` }}></div>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', letterSpacing: '3px', whiteSpace: 'nowrap' }}>{scanning ? 'SCANNING_NEURAL_SPACE' : result ? result.status === 'stego' ? 'THREAT_MATCH_POSITIVE' : 'SYSTEM_CLEAR_NEGATIVE' : 'IDLE_STANDBY'}</span>
                </div>
              </div>

              {!result && !scanning && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.15 }}>
                  <BarChart3 size={64} style={{ marginBottom: '1rem' }} />
                  <p style={{ fontSize: '0.9rem', fontWeight: 900, letterSpacing: '4px' }}>CORE_READY</p>
                  <p style={{ fontSize: '0.6rem', marginTop: '0.3rem', letterSpacing: '0.5px' }}>Neural layers synchronized. Awaiting asset upload.</p>
                </div>
              )}

              {scanning && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '1.5rem' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} style={{ position: 'absolute', inset: 0, border: '1.5px dashed var(--color-primary)', borderRadius: '50%', opacity: 0.3 }} />
                    <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ position: 'absolute', inset: '8px', border: '1.5px solid var(--color-primary)', borderRadius: '50%', borderTopColor: 'transparent', borderBottomColor: 'transparent' }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                       <Cpu size={32} color="var(--color-primary)" style={{ filter: 'drop-shadow(0 0 10px var(--color-primary))' }} />
                    </div>
                  </div>
                  <p style={{ fontFamily: 'monospace', color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 900, letterSpacing: '2px', textShadow: '0 0 5px rgba(0,220,180,0.5)' }}>MAP_GENERATION_IN_PROGRESS</p>
                  <p style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)', marginTop: '0.3rem' }}>Scanning Bit-Planes • DCT Quantization Check</p>
                </div>
              )}

              {result && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {result.status === 'error' ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
                      <AlertTriangle size={64} color="#ef4444" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 15px rgba(239,68,68,0.4))' }} />
                      <h4 style={{ color: '#ef4444', margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: 900 }}>FORENSIC_ENGINE_FAULT</h4>
                      <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem', maxWidth: '400px', lineHeight: 1.6 }}>{result.errorMsg || 'The neural forensic core encountered an unexpected termination.'}</p>
                      <button onClick={executeExtractionScan} style={{ marginTop: '2rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '0.75rem 2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 800 }}>RETRY_SCAN</button>
                    </div>
                  ) : result.status === 'stego' ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.75rem', overflow: 'hidden' }}>
                      
                      {/* TOP ROW: SIGNATURE & TELEMETRY */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem', flexShrink: 0 }}>
                        <div style={{ background: 'rgba(239,68,68,0.06)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                          <AlertTriangle size={32} color="#ef4444" style={{ filter: 'drop-shadow(0 0 10px #ef4444)', flexShrink: 0 }} />
                          <div>
                            <p style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Signature Detected</p>
                            <h4 style={{ margin: '0.3rem 0 0 0', fontSize: '1.4rem', color: '#fff', fontWeight: 900, wordBreak: 'break-word', lineHeight: 1.1 }}>{result.detectedAlgorithm}</h4>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                          {[
                            { label: 'CONF', val: `${result.confidence || 0}%`, color: 'var(--color-primary)' },
                            { label: 'ENT', val: (result.aiAnalysis?.entropy ?? '7.94').toString().slice(0, 4), color: '#f97316' },
                            { label: 'VAR', val: (result.heuristics?.variance ?? '0.003').toString().slice(0, 5), color: '#a855f7' },
                            { label: 'LYR', val: `${result.aiAnalysis?.detectionMethods?.length ?? 4}/10`, color: '#3b82f6' }
                          ].map((m, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                               <p style={{ fontSize: '0.6rem', color: '#666', margin: '0 0 0.3rem 0', fontWeight: 900 }}>{m.label}</p>
                               <p style={{ fontSize: '1.3rem', color: m.color, fontWeight: 900, margin: 0, fontFamily: 'monospace' }}>{m.val}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* BOTTOM ROW: DATA RECOVERY MODULE */}
                      <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexShrink: 0 }}>
                          <h5 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-primary)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Unlock size={20} /> RECOVERED_DATA_STREAM
                          </h5>
                          {result.payloadType === 'file' && (
                             <KineticButton onClick={handleDownloadFilePayload} style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                               <Download size={16} /> EXPORT_ASSET
                             </KineticButton>
                          )}
                        </div>
                        
                        <div style={{ flex: 1, background: 'rgba(0,0,0,0.7)', borderRadius: '10px', border: '1px solid rgba(0,220,180,0.15)', padding: '2rem', overflowY: 'auto', position: 'relative' }}>
                          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--color-primary)', boxShadow: '0 0 10px var(--color-primary)' }} />
                          {result.payloadType === 'text' ? (
                            <pre style={{ margin: 0, color: '#fff', fontSize: '1.6rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.4, fontWeight: 500 }}>{result.payloadData}</pre>
                          ) : result.payloadType === 'file' ? (
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                               <FileArchive size={64} color="var(--color-secondary)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
                               <p style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 900, margin: 0 }}>{result.payloadName}</p>
                               <p style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)', marginTop: '0.5rem' }}>Encrypted AES-256 Forensic Container</p>
                            </div>
                          ) : (
                            <div style={{ textAlign: 'center', color: '#ef4444', padding: '0.75rem' }}>
                               <ShieldAlert size={24} style={{ marginBottom: '0.3rem', opacity: 0.6 }} />
                               <p style={{ fontWeight: 900, fontSize: '0.7rem', margin: 0 }}>ENCRYPTED_MATCH</p>
                            </div>
                          )}
                        </div>
                      </div>

                    </motion.div>
                  ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden', padding: '0.75rem' }}>
                      <div style={{ background: 'rgba(34,197,94,0.05)', padding: '1rem', borderRadius: '50%', border: '1px solid rgba(34,197,94,0.15)', marginBottom: '1rem', boxShadow: '0 0 30px rgba(34,197,94,0.1)', flexShrink: 0 }}>
                         <CheckCircle2 size={48} color="#22c55e" style={{ filter: 'drop-shadow(0 0 10px #22c55e)', display: 'block' }} />
                      </div>
                      <h4 style={{ color: '#22c55e', margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '0.02em' }}>ASSET_FORENSICALLY_CLEAN</h4>
                      <p style={{ color: 'var(--color-text-dim)', fontSize: '0.7rem', maxWidth: '300px', lineHeight: 1.4 }}>No active steganographic signatures detected across all 10 neural forensic layers.</p>
                    </div>
                  )}
                </div>
              )}
            </SpotlightCard>
          </div>
        </div>

        {/* NEURAL COVERAGE TICKER (High-Speed Database Feed) */}
        <div style={{ marginTop: '1.5rem', background: 'rgba(5, 5, 12, 0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'hidden', padding: '0.6rem 1rem', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingRight: '1rem', borderRight: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
              <Zap size={12} color="var(--color-primary)" />
              <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#fff', letterSpacing: '1px' }}>FORENSIC_DB_V2.5</span>
            </div>
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', flex: 1 }}>
              <motion.div 
                animate={{ x: [0, -2500] }} 
                transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
                style={{ display: 'inline-flex', gap: '1.5rem', fontSize: '0.55rem', fontFamily: 'monospace', color: '#444' }}
              >
                {[
                  "OutGuess v0.2", "StegHide AES", "F5 Matrix", "OpenStego LSB", "DeepSound Audio", "OurSecret", "JPHide/Seek", "Stegamos 2.0",
                  "Cloak v2", "Invisible Secrets", "SilentEye", "Xiao Stego", "NeuralStego LSTM", "GAN-Bind Sync", "PixelDiff 2.1", "DCT-Quantizer",
                  "Wavelet L3", "DSSS Spectrum", "FHSS Hopping", "LSB-Matching", "Bit-Plane Slice", "Huffman-Inject", "TEA Append", "Header Gaps",
                  "Exif-Marker", "ICC-Profile", "Quant-Table", "CLUT Warp", "Alpha-Masking", "Noise-Synth", "Freq-Shift", "Pulse-Inject",
                  "MIDI-Pitch", "MP3-Padding", "OGG-Comments", "FLAC-Meta", "MKV-Stream", "AVI-Interleave", "MP4-MooV", "GIF-Palette",
                  "WebP-VP8", "TIFF-Tiled", "BMP-DIB", "ICO-Bundle", "PDF-XRef", "DocX-XML", "PPTX-Slide", "XLSX-Cell", "DNS-Tunnel", 
                  "ICMP-Padding", "IPv6-Flow", "TCP-Seq", "UDP-Length", "HTTP-Cookie", "SSL-Cert", "X.509-Ext", "WASM-Global", "SVG-Path", "Canvas-Pixel", "WebGL-Map"
                ].map((algo, i) => (
                  <span key={i} style={{ color: i % 5 === 0 ? 'var(--color-primary)' : 'inherit', opacity: i % 5 === 0 ? 0.9 : 0.4, fontWeight: i % 5 === 0 ? 900 : 400 }}>● {algo}</span>
                ))}
                {/* Seamless Repeat */}
                {[
                  "OutGuess v0.2", "StegHide AES", "F5 Matrix", "OpenStego LSB", "DeepSound Audio", "OurSecret", "JPHide/Seek", "Stegamos 2.0"
                ].map((algo, i) => (
                  <span key={i + 200} style={{ opacity: 0.4 }}>● {algo}</span>
                ))}
              </motion.div>
            </div>
            <div style={{ paddingLeft: '2rem', borderLeft: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
               <p style={{ fontSize: '0.65rem', color: 'var(--color-primary)', margin: 0, fontWeight: 900 }}>REGISTRY_ONLINE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detection;
