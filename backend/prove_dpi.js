async function runDPIProof() {
  console.log('--- [SENTINEL V6 DPI PROOF] ---');
  const target = 'http://localhost:8888';
  
  try {
    const res = await fetch('http://localhost:5001/api/threat/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: target })
    });
    const data = await res.json();
    console.log(`\n[ANALYZING] ${target}`);
    console.log(`> RISK SCORE: ${data.riskScore}%`);
    console.log(`> STATUS: ${data.isSuspicious ? '🚨 THREAT' : '✅ SAFE'}`);
    console.log(`> REASON: ${data.threatReason}`);
    console.log(`> LIVE AUDIT: ${data.logs.find(l => l.includes('LIVE CONTENT AUDIT'))}`);
    console.log(`> AI FORENSIC: ${data.logs.find(l => l.includes('[AI SENTINEL ASSESSMENT]'))?.split(']: ')[1]}`);
  } catch (e) {
    console.error(`Failed to scan ${target}`);
  }
}

runDPIProof();
