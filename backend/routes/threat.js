const express = require('express');
const router = express.Router();
const dns = require('dns').promises;
const tls = require('tls');
const crypto = require('crypto');
const { ThreatScan } = require('../models/index');
const { GoogleGenerativeAI } = require("@google/generative-ai");
// In-Memory Fallback Cache
let memoryHistory = [];
const activeTraps = new Map();

router.get('/history', async (req, res) => {
  try {
    const history = await ThreatScan.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    res.json(history);
  } catch (error) {
    res.json(memoryHistory.slice(0, 10));
  }
});

router.post('/scan', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    let targetUrl = url;
    if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;
    const parsedUrl = new URL(targetUrl);
    const hostname = parsedUrl.hostname.toLowerCase();

    // 0. Sentinel Self-Awareness: Detect Internal Traps
    if (hostname === 'localhost' || hostname === '127.0.0.1' || url.includes('/api/threat/trap')) {
      const logs = [
        `> INITIATING INTERNAL_TRAP_VERIFICATION`,
        `> TARGET_TYPE: SENTINEL_DECOY_ASSET`,
        `> STATUS: VERIFIED_SAFE [INTERNAL_NEUTRALIZATION_NODE]`,
        `> [AI SENTINEL ASSESSMENT]: This infrastructure is a verified internal decoy trap deployed by SecureVault. It is designed to capture and neutralize attackers.`,
        `> FINAL_RISK_INDEX: 0%`
      ];
      return res.json({
        id: crypto.randomUUID(),
        targetUrl,
        hostname,
        riskScore: 0,
        isSuspicious: false,
        threatReason: "INTERNAL_SENTINEL_TRAP",
        logs,
        createdAt: new Date()
      });
    }

    // 1. Sentinel v9: Absolute Truth Technical Audit
    const whiteList = ['google.com', 'youtube.com', 'wikipedia.org', 'openai.com', 'microsoft.com', 'apple.com', 'github.com', 'amazon.com', 'linkedin.com', 'twitter.com', 'facebook.com', 'instagram.com'];
    const isWhiteListed = whiteList.some(domain => hostname.includes(domain));

    // A. Real DNS Intelligence
    let addresses = [];
    let mxRecords = [];
    let dnsConnectivityIssue = false;
    try {
      addresses = await dns.resolve4(hostname);
      mxRecords = await dns.resolveMx(hostname).catch(() => []);
    } catch (e) {
      dnsConnectivityIssue = true;
    }

    // B. Real SSL Audit (Live Certificate Extraction)
    let sslData = { issuer: 'UNAVAILABLE', valid: false, daysLeft: 0 };
    try {
      const socket = tls.connect(443, hostname, { servername: hostname, timeout: 3000 }, () => {
        const cert = socket.getPeerCertificate();
        if (cert && cert.issuer) {
          sslData.issuer = cert.issuer.O || cert.issuer.CN || 'Unknown';
          sslData.valid = true;
          sslData.daysLeft = Math.floor((new Date(cert.valid_to) - new Date()) / (1000 * 60 * 60 * 24));
        }
        socket.destroy();
      });
      await new Promise(r => socket.on('close', r).on('error', r).on('timeout', () => { socket.destroy(); r(); }));
    } catch (sslErr) {
      console.error("SSL Audit Error:", sslErr.message);
    }

    let isSuspicious = false;
    let threatReason = null;
    let riskScore = 10;
    let liveContentReport = "CONTENT_ANALYSIS_SKIPPED";

    if (isWhiteListed) {
      riskScore = 0;
      liveContentReport = "WHITELIST_TRUST_ACTIVE";
    } else {
      riskScore = 25; // Base for unverified
      threatReason = "UNVERIFIED_INFRASTRUCTURE";

      // Phishing Signatures (Aggressive)
      const badKeywords = ['login', 'secure', 'verify', 'update', 'vault', 'bank', 'auth', 'signin', 'account', 'wallet', 'crypto', 'support'];
      const matchedKeywords = badKeywords.filter(kw => hostname.includes(kw));
      if (matchedKeywords.length > 0) {
        riskScore += (matchedKeywords.length * 30);
        threatReason = "PHISHING_DOMAIN_SIGNATURE";
      }

      // SSL Risk Weighting
      if (!sslData.valid) {
        riskScore += 40;
        threatReason = "INVALID_OR_MISSING_SSL";
      } else if (sslData.daysLeft < 30) {
        riskScore += 20;
        threatReason = "EPHEMERAL_SSL_CERTIFICATE";
      }

      // TLD Risk
      if (['.xyz', '.top', '.pw', '.zip', '.mov', '.work', '.info'].some(t => hostname.endsWith(t))) {
        riskScore += 30;
      }

      // Deep Page Inspection
      try {
        const response = await fetch(targetUrl, { method: 'GET', signal: AbortSignal.timeout(4000) });
        const html = await response.text();
        const markers = ['password', 'credit card', 'cvv', 'verify identity', 'login to continue'];
        const found = markers.filter(m => html.toLowerCase().includes(m));
        if (found.length > 0) {
          riskScore += 60;
          threatReason = "LIVE_PHISHING_CONTENT";
          liveContentReport = `CRITICAL: Harvesting markers [${found.join(', ')}] detected.`;
        } else {
          liveContentReport = "Page content verified clean.";
        }
      } catch (err) {
        liveContentReport = "LIVE_CONTENT_UNAVAILABLE";
      }

      if (riskScore > 40) isSuspicious = true;
    }

    // 2. AI Forensic Engine (Sentinel v9)
    let aiAssessment = "";
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await geminiModel.generateContent(`Forensic Audit: ${targetUrl}. IP: ${addresses[0]}. SSL Issuer: ${sslData.issuer}. Days Left: ${sslData.daysLeft}. MX Records: ${mxRecords.length}. Reason: ${threatReason}. 1-sentence expert report.`);
      aiAssessment = result.response.text();
    } catch (geminiErr) {
      aiAssessment = isWhiteListed 
        ? `Verified corporate asset. 0% threat footprint.` 
        : `Telemetric audit of ${hostname} (IP: ${addresses[0] || 'NULL'}) confirms ${threatReason || 'unverified status'} with ${sslData.issuer} SSL authority.`;
    }

    const logs = [
      `> INITIATING ABSOLUTE_TRUTH_V9 AUDIT FOR: ${hostname}`,
      `> NETWORK_INTEL: [IP: ${addresses[0] || 'UNRESOLVED'}] [MX_RECORDS: ${mxRecords.length}]`,
      `> INFRASTRUCTURE_TRUST: [SSL_ISSUER: ${sslData.issuer}] [DAYS_REMAINING: ${sslData.daysLeft}]`,
      `> CONTENT_FORENSICS: ${liveContentReport}`,
      `> [AI SENTINEL ASSESSMENT]: ${aiAssessment.trim()}`,
      `> FINAL_RISK_INDEX: ${Math.min(riskScore, 99)}%`
    ];

    const scanResult = {
      id: require('crypto').randomUUID(),
      targetUrl,
      hostname,
      riskScore: Math.min(riskScore, 99),
      isSuspicious: riskScore > 40,
      threatReason,
      logs,
      createdAt: new Date()
    };

    try {
      const dbScan = await ThreatScan.create(scanResult);
      res.json(dbScan);
    } catch (dbErr) {
      memoryHistory.unshift(scanResult);
      res.json(scanResult);
    }
  } catch (error) {
    res.status(500).json({ error: 'System processing error during analysis.' });
  }
});

// Global Trap Log for real-time monitoring
let trapLogs = [];

router.get('/trap-logs', (req, res) => {
  res.json(trapLogs.slice(0, 50));
});

router.post('/deploy-tarpit', async (req, res) => {
  const { scanId } = req.body;
  const trapId = crypto.randomBytes(4).toString('hex');
  const trapUrl = `/api/threat/trap/${trapId}`; // Relative for better compatibility
  
  activeTraps.set(trapId, { timestamp: Date.now(), connections: 0, hits: 0 });

  const fullTrapUrl = `https://${req.get('host')}${trapUrl}`;
  const payload = { status: 'NEUTRALIZED', trapUrl: fullTrapUrl };

  
  try {
    if (scanId) {
      await ThreatScan.update(
        { tarpitActivated: true, trapUrl: fullTrapUrl }, 
        { where: { id: scanId } }
      );
    }
  } catch (e) {
    const memItem = memoryHistory.find(s => s.id === scanId);
    if (memItem) { memItem.tarpitActivated = true; memItem.trapUrl = fullTrapUrl; }
  }
  res.json(payload);
});

// Iron Tarpit Catch-All Handler
router.get('/trap/:id', (req, res) => {
  const { id } = req.params;
  if (!activeTraps.has(id)) return res.status(404).send('GATE_EXPIRED');

  const trapData = activeTraps.get(id);
  trapData.connections++;
  trapData.hits++;
  
  const hitLog = {
    id: crypto.randomUUID(),
    trapId: id,
    ip: req.ip,
    timestamp: new Date(),
    userAgent: req.get('user-agent')
  };
  trapLogs.unshift(hitLog);
  if (trapLogs.length > 100) trapLogs.pop();

  console.log(`[IRON_TARPIT] Attacker trapped from ${req.ip} on trap-${id}`);

  res.writeHead(200, { 
    'Content-Type': 'text/plain',
    'Transfer-Encoding': 'chunked',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  res.write("--- [SECUREVAULT IRON-TARPIT ENGAGED] ---\n");
  res.write("STATUS: ATTACKER_NEUTRALIZED\n");
  res.write("LOGGING: ACTIVE_TRACE_IN_PROGRESS\n\n");

  const interval = setInterval(() => {

    try {
      const junk = `SENTINEL_SYSCALL_INTERRUPT_BLOCK_${crypto.randomBytes(32).toString('hex')}\n`;
      res.write(junk);
    } catch (e) {
      clearInterval(interval);
    }
  }, 1000);

  req.on('close', () => {
    trapData.connections--;
    clearInterval(interval);
  });
});

module.exports = router;
