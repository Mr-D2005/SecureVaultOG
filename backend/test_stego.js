try {
    const stego = require('./utils/stego');
    console.log('[OK] stego utils loaded. Functions:', Object.keys(stego).join(', '));
} catch(e) {
    console.error('[CRASH] stego utils failed:', e.message);
}

try {
    const route = require('./routes/stego');
    console.log('[OK] stego route loaded');
} catch(e) {
    console.error('[CRASH] stego route failed:', e.message);
}

try {
    const server = require('./server.js');
    console.log('[OK] server loaded');
} catch(e) {
    console.error('[CRASH] server failed:', e.message);
}
