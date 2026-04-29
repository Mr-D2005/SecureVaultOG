const fs = require('fs');
const { analyzeSteganographyAI } = require('./backend/utils/stego');

const buffer = fs.readFileSync('c:\\Users\\hp\\Desktop\\SecureVaultOG\\normal_test.png');
const result = analyzeSteganographyAI(buffer, 'normal_test.png');

console.log('=== FORENSIC ANALYSIS RESULT ===');
console.log('Verdict:', result.isThirdPartyStego ? 'FLAGGED' : 'CLEAN');
console.log('Confidence:', result.confidence + '%');
console.log('Detected Algorithm:', result.detectedAlgorithm);
console.log('Methods Triggered:', result.detectionMethods);
console.log('Score:', result.score);
console.log('================================');

if (!result.isThirdPartyStego && result.confidence === "0.0") {
    console.log('TEST PASSED: Normal file correctly identified as clean.');
} else {
    console.log('TEST FAILED: False positive detected.');
    process.exit(1);
}
