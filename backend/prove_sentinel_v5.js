// Using native fetch (Node 18+)

const testUrls = [
  'https://youtube.com',
  'https://g00gle.com',
  'https://secure-login-verify-account.xyz',
  'https://ajs8912jkd012.top'
];

async function runTests() {
  console.log('--- [SENTINEL V5 ADVANCED DETECTION PROOF] ---');
  for (const url of testUrls) {
    try {
      const res = await fetch('http://localhost:5001/api/threat/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      console.log(`\n[ANALYZING] ${url}`);
      console.log(`> RISK SCORE: ${data.riskScore}%`);
      console.log(`> STATUS: ${data.isSuspicious ? '🚨 THREAT' : '✅ SAFE'}`);
      console.log(`> REASON: ${data.threatReason || 'CLEAN'}`);
      console.log(`> AI REPORT: ${data.logs.find(l => l.includes('[AI SENTINEL ASSESSMENT]'))?.split(']: ')[1]}`);
    } catch (e) {
      console.error(`Failed to scan ${url}`);
    }
  }
}

runTests();
