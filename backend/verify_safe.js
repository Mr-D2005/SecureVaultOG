const BASE_URL = 'http://localhost:5001/api/threat';

async function verifyYouTube() {
  console.log('--- [VERIFYING SAFE DOMAINS] ---');
  try {
    const res = await fetch(`${BASE_URL}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://www.youtube.com' })
    });
    const data = await res.json();
    console.log('Target: youtube.com');
    console.log('Is Suspicious:', data.isSuspicious);
    console.log('Risk Score:', data.riskScore);
    
    if (data.isSuspicious === false && data.riskScore === 0) {
      console.log('\n✅ SUCCESS: YouTube is correctly identified as safe.');
    } else {
      console.log('\n❌ FAILURE: YouTube is still being flagged.');
    }
  } catch (e) {
    console.error('Test failed:', e.message);
  }
}

verifyYouTube();
