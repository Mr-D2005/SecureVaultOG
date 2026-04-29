const BASE_URL = 'http://localhost:5001/api/threat';

async function proveIntelligence() {
  console.log('--- [PROVING THREAT INTELLIGENCE CORE] ---');
  
  const targets = [
    { name: 'SAFE (Whitelisted)', url: 'https://youtube.com' },
    { name: 'SAFE (Heuristic Check)', url: 'https://wikipedia.org' },
    { name: 'SAFE (Heuristic Check)', url: 'https://openai.com' },
    { name: 'MALICIOUS (Simulated)', url: 'https://secure-login-vault.xyz' }
  ];

  for (const target of targets) {
    console.log(`\n[ANALYZING] ${target.name}: ${target.url}`);
    try {
      const res = await fetch(`${BASE_URL}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target.url })
      });
      const data = await res.json();
      
      console.log(`> RISK LEVEL: ${data.riskScore}%`);
      console.log(`> STATUS: ${data.isSuspicious ? '🚨 THREAT DETECTED' : '✅ VERIFIED SAFE'}`);
      if (data.threatReason) console.log(`> REASON: ${data.threatReason}`);
      
      console.log('> LOGS:');
      data.logs.slice(-2).forEach(log => console.log(`  ${log}`));
    } catch (e) {
      console.log(`> SCAN FAILED: ${e.message}`);
    }
  }
}

proveIntelligence();
