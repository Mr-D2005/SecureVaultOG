async function runV8Proof() {
  console.log('--- [SENTINEL V8 TOTAL TELEMETRY PROOF] ---');
  const target = 'https://secure-login-update.xyz';
  
  try {
    const res = await fetch('http://localhost:5001/api/threat/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: target })
    });
    const data = await res.json();
    console.log(`\n[ANALYZING] ${target}`);
    console.log('\n--- LIVE FORENSIC LOGS ---');
    data.logs.forEach(log => console.log(log));
  } catch (e) {
    console.error(`Failed to scan ${target}`);
  }
}

runV8Proof();
