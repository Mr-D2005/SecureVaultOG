async function verifyRavan() {
  console.log('--- [RAVAN NEURAL LINK VERIFICATION] ---');
  try {
    const res = await fetch('http://localhost:5001/api/ravan/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: "Hello Ravan, confirm your identity and neural status.", 
        history: [] 
      })
    });
    const data = await res.json();
    console.log('Response Status:', res.status);
    console.log('Ravan Response:', data.reply);
    
    if (data.reply.includes('offline mode')) {
      console.log('RESULT: FAIL - Ravan is still offline.');
    } else {
      console.log('RESULT: SUCCESS - Ravan is ONLINE and INTELLIGENT.');
    }
  } catch (err) {
    console.error('RESULT: ERROR - Could not connect to Ravan:', err.message);
  }
}

verifyRavan();
