const BASE_URL = 'http://localhost:5001/api/threat';

async function runTests() {
  console.log('--- [STARTING THREAT INTEL FUNCTIONAL TESTS] ---');

  try {
    // 1. Test Scan (Suspicious)
    console.log('\n[TEST 1] Scanning suspicious domain...');
    const scanRes = await fetch(`${BASE_URL}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://secure-login-vault.xyz' })
    });
    const scanData = await scanRes.json();
    console.log('Scan Status:', scanRes.status);
    console.log('Risk Score:', scanData.riskScore);
    console.log('Is Suspicious:', scanData.isSuspicious);
    const scanId = scanData.id;

    // 2. Test Tarpit Deployment
    console.log('\n[TEST 2] Deploying Tarpit...');
    const tarpitRes = await fetch(`${BASE_URL}/deploy-tarpit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://secure-login-vault.xyz', scanId })
    });
    const tarpitData = await tarpitRes.json();
    console.log('Tarpit Status:', tarpitRes.status);
    console.log('Trap URL:', tarpitData.trapUrl);

    // 3. Test History
    console.log('\n[TEST 3] Fetching History...');
    const historyRes = await fetch(`${BASE_URL}/history`);
    const historyData = await historyRes.json();
    console.log('History Items Count:', historyData.length);
    const latest = historyData[0];
    console.log('Latest Scan Tarpit Activated:', latest.tarpitActivated);

    if (latest.tarpitActivated) {
      console.log('\n--- [ALL TESTS PASSED SUCCESSFULLY] ---');
    } else {
      console.log('\n--- [TEST FAILED: Tarpit activation not recorded] ---');
    }

  } catch (error) {
    console.error('\n--- [TEST FAILED] ---');
    console.error(error);
  }
}

runTests();
