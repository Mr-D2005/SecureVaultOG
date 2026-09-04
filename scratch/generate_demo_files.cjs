const fs = require('fs');
const path = require('path');

// Padded PNG carrier (header + 2000 bytes padding + footer) to pass >500 byte threat scan threshold
const pngHeader = Buffer.from('89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4890000000B4944415408D76360000200000500010D0A2DB4', 'hex');
const pngPadding = Buffer.alloc(2000, 0x00);
const pngFooter = Buffer.from('0000000049454E44AE426082', 'hex');
const pngBytes = Buffer.concat([pngHeader, pngPadding, pngFooter]);

const outputDir = 'c:\\Users\\hp\\Desktop\\stego_demo_files';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

console.log('--- GENERATING DEMO STEGO FILES FOR TESTING ---');

// 1. OpenStego Demo Image
const openstegoDemo = Buffer.concat([
    pngBytes,
    Buffer.from('--- [openstego_payload_marker] ---')
]);
fs.writeFileSync(path.join(outputDir, 'openstego_demo.png'), openstegoDemo);
console.log('Created: openstego_demo.png');

// 2. OurSecret Demo Image
const oursecretDemo = Buffer.concat([
    pngBytes,
    Buffer.from('[oursecret] hidden_data_payload_here')
]);
fs.writeFileSync(path.join(outputDir, 'oursecret_demo.png'), oursecretDemo);
console.log('Created: oursecret_demo.png');

// 3. StegHide Demo Image
const steghideDemo = Buffer.concat([
    pngBytes,
    Buffer.from('stghide encryption block v2')
]);
fs.writeFileSync(path.join(outputDir, 'steghide_demo.png'), steghideDemo);
console.log('Created: steghide_demo.png');

// 4. Appended Plaintext Demo Image (Simple Join)
const appendedTextDemo = Buffer.concat([
    pngBytes,
    Buffer.from('TOP_SECRET: Ravan Forensic Node activated. NetraVault deployment is functional.')
]);
fs.writeFileSync(path.join(outputDir, 'appended_text_demo.png'), appendedTextDemo);
console.log('Created: appended_text_demo.png');

// 5. Appended ZIP File Demo Image (Zip-in-Image technique)
// A tiny valid ZIP archive containing one small file "secret.txt"
const tinyZipBytes = Buffer.from(
    '504b03040a00000000005b8b9a58b29e02c91b0000001b0000000a0000007365637265742e7478745468697320697320612068696464656e207a697020617263686976652e504b010214000a00000000005b8b9a58b29e02c91b0000001b0000000a0000000000000000000000a481000000007365637265742e747874504b0506000000000100010038000000490000000000',
    'hex'
);
const appendedZipDemo = Buffer.concat([
    pngBytes,
    tinyZipBytes
]);
fs.writeFileSync(path.join(outputDir, 'appended_zip_demo.png'), appendedZipDemo);
console.log('Created: appended_zip_demo.png');

console.log(`\nAll demo files successfully generated in: ${outputDir}`);
