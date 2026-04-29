async function runZeroTrustProof() {
  console.log('--- [SENTINEL V7 ZERO TRUST PROOF] ---');
  const target = 'https://chutiya-investigation.info'; // Not a "scary" name, but unverified TLD
  
  try {
    const res = await fetch('http://localhost:5001/api/threat/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: target })
    });
    const data = await res.json();
    console.log(`\n[ANALYZING] ${target}`);
    console.log(`> RISK SCORE: ${data.riskScore}%`);
    console.log(`> STATUS: ${data.isSuspicious ? '🚨 THREAT/SUSPICIOUS' : '✅ SAFE'}`);
    console.log(`> REASON: ${data.threatReason}`);
    console.log(`> AI FORENSIC: ${data.logs.find(l => l.includes('[AI SENTINEL ASSESSMENT]'))?.split(']: ')[1]}`);
  } catch (e) {
    console.error(`Failed to scan ${target}`);
  }
}

runZeroTrustProof();
