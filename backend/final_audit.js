async function runFinalAudit() {
  console.log('--- [FINAL TECHNICAL AUDIT: LIVE PROOF] ---');
  const targets = ['google.com', 'wikipedia.org'];
  
  for (const target of targets) {
    try {
      const res = await fetch('http://localhost:5001/api/threat/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: `https://${target}` })
      });
      const data = await res.json();
      console.log(`\n[SCANNING LIVE ASSET] ${target}`);
      
      const ipLog = data.logs.find(l => l.includes('NETWORK_INTEL'));
      const sslLog = data.logs.find(l => l.includes('INFRASTRUCTURE_TRUST'));
      
      console.log(`> ${ipLog}`);
      console.log(`> ${sslLog}`);
      console.log(`> AI VERDICT: ${data.logs.find(l => l.includes('[AI SENTINEL ASSESSMENT]'))?.split(']: ')[1]}`);
    } catch (e) {
      console.error(`Failed to scan ${target}`);
    }
  }
}

runFinalAudit();
