const fs = require('fs');

const API_BASE = 'http://localhost:5001/api';

async function runTests() {
    console.log('--- STARTING E2E INTEGRATION TESTS ---');

    let stegoFile = null;
    let encResult = null;

    try {
        console.log('\\n[1/8] Test: Register User');
        const resReg = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username: 'testuser_agent', email: 'agent123@example.com', password: 'Password123!', accountType: 'Personal' })
        });
        const dReg = await resReg.json();
        console.log(`Status: ${resReg.status}. Result:`, dReg.msg || dReg.message || (dReg.success ? 'Success' : 'Failed'));
    } catch(e) { console.error('Register failed', e.message); }

    try {
        console.log('\\n[2/8] Test: Login');
        const resLog = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email: 'agent123@example.com', password: 'Password123!' })
        });
        const dLog = await resLog.json();
        console.log(`Status: ${resLog.status}. Result:`, dLog.token ? 'Login Success' : 'Login Failed');
    } catch(e) { console.error('Login failed', e.message); }

    try {
        console.log('\\n[3/8] Test: Forgot Password / Recovery Mail');
        const resFor = await fetch(`${API_BASE}/auth/forgot-password`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email: 'agent123@example.com' })
        });
        const dFor = await resFor.json();
        console.log(`Status: ${resFor.status}. Result:`, dFor.msg || 'Recovery flow done');
    } catch(e) { console.error('Forgot password failed', e.message); }

    try {
        console.log('\\n[4/8] Test: Encrypt Payload');
        const resEnc = await fetch(`${API_BASE}/encrypt/data`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ data: 'Agent super secret payload', type: 'message', name: 'AgentTest' })
        });
        encResult = await resEnc.json();
        console.log(`Status: ${resEnc.status}. Result:`, encResult.success ? 'Encrypt Success' : 'Encrypt Failed', encResult.msg || encResult.details || '');
    } catch(e) { console.error('Encrypt failed', e.message); }

    try {
        console.log('\\n[5/8] Test: Decrypt Payload');
        if (encResult && encResult.success) {
            const resDec = await fetch(`${API_BASE}/encrypt/unseal`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ sealedUrl: encResult.sealedUrl, sealedKey: encResult.sealedKey, iv: encResult.iv })
            });
            const dDec = await resDec.json();
            console.log(`Status: ${resDec.status}. Result:`, dDec.success ? 'Decrypt Success' : 'Decrypt Failed', dDec.decryptedData || dDec.msg);
        } else {
            console.log('Skipping due to Encrypt failure.');
        }
    } catch(e) { console.error('Decrypt failed', e.message); }

    console.log('\\n[6/8 & 7/8] Test: Hide Stego & Detect Stego');
    try {
        const dummyImageB64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

        const resStego = await fetch(`${API_BASE}/stego/inject`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                carrierBase64: dummyImageB64, 
                carrierMime: 'image/png', 
                carrierName: 'test.png', 
                payloadText: 'Hidden agent message',
                password: 'sv_default'
            })
        });

        if (resStego.ok) {
            const buff = await resStego.arrayBuffer();
            const outBase64 = 'data:image/png;base64,' + Buffer.from(buff).toString('base64');
            console.log(`Inject Status: ${resStego.status}. File generated successfully (${buff.byteLength} bytes).`);
            
            const resExt = await fetch(`${API_BASE}/stego/extract`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ carrierBase64: outBase64, carrierName: 'secured_test.png' })
            });
            const dExt = await resExt.json();
            console.log(`Extract Status: ${resExt.status}. Stegotext:`, dExt.type === 'text' ? dExt.data : dExt.msg || dExt.details);
        } else {
            const errD = await resStego.text();
            console.log(`Inject failed. Status: ${resStego.status}.`, errD);
        }
    } catch(e) { console.error('Stego failed', e.message); }

    console.log('\\n--- TESTS COMPLETE ---');
}

runTests();
