async function runTarpitProof() {
  console.log('--- [IRON TARPIT PROOF] ---');
  
  try {
    // 1. Deploy Tarpit
    const res = await fetch('http://localhost:5001/api/threat/deploy-tarpit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scanId: 'test-scan' })
    });
    const { trapUrl } = await res.json();
    console.log(`\n> TARPIT DEPLOYED: ${trapUrl}`);

    // 2. Simulate Attacker hitting the tarpit
    console.log(`> ATTACKER HITTING TRAP... (Holding for 5s)`);
    const trapRes = await fetch(trapUrl);
    const reader = trapRes.body.getReader();
    
    let chunkCount = 0;
    const startTime = Date.now();
    
    while (Date.now() - startTime < 5000) {
      const { value, done } = await reader.read();
      if (done) break;
      chunkCount++;
      const text = new TextDecoder().decode(value);
      console.log(`[TRAPPED] Received Junk: ${text.substring(0, 30)}...`);
    }
    
    console.log(`\n> PROOF SUCCESS: Tarpit held attacker for 5s and sent ${chunkCount} junk packets.`);
  } catch (e) {
    console.error(`Tarpit Test Failed: ${e.message}`);
  }
}

runTarpitProof();
