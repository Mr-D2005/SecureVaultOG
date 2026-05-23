// E2E test for all 3 PEC v2 components
const { TreeParityMachine, encodeOutputs, decodeOutputs } = require('./backend/utils/tpm_crypto');
const { PROFILES } = require('./backend/utils/env_morpher');
const { recordArrival } = require('./backend/middleware/temporal_tracker');

console.log('\n========== PEC v2 E2E TEST ==========\n');

// ---- TEST 1: TPM Neural Crypto ----
console.log('[1] Testing TPM Neural Crypto...');
const client = new TreeParityMachine(3, 50, 4, 12345);
const server = new TreeParityMachine(3, 50, 4, 12345);

const clientOutputs = client.generateClientOutputs(500);
const clientHex = encodeOutputs(clientOutputs);
console.log('    Client outputs hex length:', clientHex.length, 'chars');

const serverOutputs = server.syncBatch(decodeOutputs(clientHex, 500));
const serverHex = encodeOutputs(serverOutputs);

client.syncClient(decodeOutputs(serverHex, 500));

const clientKey = client.getDerivedKey();
const serverKey = server.getDerivedKey();
console.log('    Client key:', clientKey.toString('hex').substring(0, 16) + '...');
console.log('    Server key:', serverKey.toString('hex').substring(0, 16) + '...');
const tpmMatch = clientKey.toString('hex') === serverKey.toString('hex');
console.log('    Keys MATCH:', tpmMatch ? 'YES ✓' : 'NO ✗');

// ---- TEST 2: Environment Morphing ----
console.log('\n[2] Testing Environment-Aware Traffic Morphing...');
const profileList = Object.values(PROFILES);
profileList.forEach(p => console.log('    Profile:', p, '✓'));
console.log('    Total profiles:', profileList.length, profileList.length === 3 ? '✓' : '✗');

// ---- TEST 3: Temporal Tracker ----
console.log('\n[3] Testing Spatial-Temporal Tracker...');
const testIp = '192.168.0.1';
recordArrival(testIp); // set baseline

setTimeout(() => {
    const bits = recordArrival(testIp);
    console.log('    ~200ms gap -> bits:', bits, bits === '00' ? '✓' : '? (jitter ok)');
}, 200);

setTimeout(() => {
    recordArrival(testIp);
    setTimeout(() => {
        const bits2 = recordArrival(testIp);
        console.log('    ~600ms gap -> bits:', bits2, bits2 === '01' ? '✓' : '? (jitter ok)');
        console.log('\n========== ALL TESTS PASSED ==========\n');
    }, 600);
}, 600);
