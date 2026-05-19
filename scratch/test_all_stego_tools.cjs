const fs = require('fs');
const { analyzeSteganographyAI, attemptThirdPartyExtraction } = require('../backend/utils/stego');

// Create dummy image carrier
const dummyCarrier = Buffer.alloc(100);
// Add dummy PNG signature
dummyCarrier.write('PNG', 1); 
dummyCarrier[96] = 0x49; dummyCarrier[97] = 0x45; dummyCarrier[98] = 0x4E; dummyCarrier[99] = 0x4D; // Almost PNG end

console.log('--- STARTING COMPREHENSIVE STEGO TOOL SCANNER TESTS ---');

const testCases = [
    {
        name: 'OpenStego Signature Check',
        buffer: Buffer.concat([dummyCarrier, Buffer.from('Some OpenStego LSB signature here')]),
        expectedAlgo: 'OpenStego RandomLSB'
    },
    {
        name: 'SilentEye Signature Check',
        buffer: Buffer.concat([dummyCarrier, Buffer.from('Hiding metadata via SilentEye tool')]),
        expectedAlgo: 'SilentEye 0.4.1'
    },
    {
        name: 'OurSecret Signature Check',
        buffer: Buffer.concat([dummyCarrier, Buffer.from('[oursecret] password protected file')]),
        expectedAlgo: 'OurSecret 1.4'
    },
    {
        name: 'StegHide Signature Check',
        buffer: Buffer.concat([dummyCarrier, Buffer.from('stghide encryption block header')]),
        expectedAlgo: 'StegHide AES-256'
    },
    {
        name: 'OutGuess Signature Check',
        buffer: Buffer.concat([dummyCarrier, Buffer.from('outguess key pattern matches here')]),
        expectedAlgo: 'OutGuess v0.2'
    },
    {
        name: 'ZIP File Append Recovery',
        buffer: Buffer.concat([
            Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00, 0x0B, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0x60, 0x00, 0x02, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82]),
            Buffer.from([0x50, 0x4B, 0x03, 0x04, 0x0A, 0x00, 0x00, 0x00, 0x00, 0x00]) // Dummy ZIP header
        ]),
        expectedExtractionMethod: 'STRUCTURED_ZIP_APPEND',
        expectedType: 'file'
    },
    {
        name: 'PNG File Append Recovery',
        buffer: Buffer.concat([
            Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00, 0x0B, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0x60, 0x00, 0x02, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82]),
            Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]) // Dummy PNG header
        ]),
        expectedExtractionMethod: 'STRUCTURED_PNG_APPEND',
        expectedType: 'file'
    },
    {
        name: 'Plaintext Append Recovery',
        buffer: Buffer.concat([
            Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00, 0x0B, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0x60, 0x00, 0x02, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82]),
            Buffer.from('This is a hidden message appended at the end of the file')
        ]),
        expectedExtractionMethod: 'APPENDED_PLAINTEXT_RECOVERY',
        expectedType: 'text'
    }
];

let failed = 0;

for (const tc of testCases) {
    const analysis = analyzeSteganographyAI(tc.buffer, 'test.png');
    const extraction = attemptThirdPartyExtraction(tc.buffer, analysis);

    console.log(`\nTesting Case: ${tc.name}`);
    console.log(`- Detected Algo: ${analysis.detectedAlgorithm}`);
    console.log(`- Threat matches: ${analysis.isThirdPartyStego ? 'YES' : 'NO'}`);
    
    if (tc.expectedAlgo) {
        if (analysis.detectedAlgorithm === tc.expectedAlgo) {
            console.log(`  ✅ [PASS] Algorithm matched successfully.`);
        } else {
            console.log(`  ❌ [FAIL] Expected: "${tc.expectedAlgo}", Got: "${analysis.detectedAlgorithm}"`);
            failed++;
        }
    }

    if (tc.expectedExtractionMethod) {
        if (extraction && extraction.method === tc.expectedExtractionMethod && extraction.type === tc.expectedType) {
            console.log(`  ✅ [PASS] Recovery matched successfully: Method=${extraction.method}, Type=${extraction.type}`);
        } else {
            console.log(`  ❌ [FAIL] Recovery failed. Extraction:`, extraction);
            failed++;
        }
    }
}

console.log('\n--- VERIFICATION COMPLETED ---');
if (failed === 0) {
    console.log('✅ ALL TESTS PASSED SUCCESSFULLY!');
} else {
    console.log(`❌ ${failed} TESTS FAILED.`);
    process.exit(1);
}
