/**
 * Temporal Steganography Sender
 * Orchestrates network requests to encode 2 bits of data into the time delay between requests.
 */

// Delay buckets corresponding to 2 bits
const DELAY_MAP = {
    '00': 200,
    '01': 600,
    '10': 1000,
    '11': 1400
};

/**
 * Extracts 2 bits from the payload hex (e.g. from the HMAC signature) to use as a temporal checksum.
 */
export function getTemporalChecksumBits(payloadHex) {
    // Just take the first hex character, modulo 4, convert to binary string '00' to '11'
    const val = parseInt(payloadHex.charAt(0), 16) % 4;
    return val.toString(2).padStart(2, '0');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Sends the covert payload using Spatial-Temporal hybrid steganography.
 * 
 * @param {string} token Session token
 * @param {Object} headers Morphed headers containing the payload
 * @param {string} payloadHex Original hex payload (to derive checksum)
 * @returns {Promise<Object>} The fetch response
 */
export async function sendTemporalPayload(token, headers, payloadHex) {
    const bits = getTemporalChecksumBits(payloadHex);
    const delayMs = DELAY_MAP[bits];

    console.log(`[Temporal Stego] Sending checksum bits '${bits}' via ${delayMs}ms delay...`);

    // 1. Send DUMMY packet to start the server's temporal tracker
    try {
        await fetch('/api/covert-sync', {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                // Add a dummy morphed header so it looks like the real thing but isn't
                'X-Dummy-Ping': 'true'
            }
        });
    } catch (e) {
        console.warn("Dummy ping failed, continuing anyway...", e);
    }

    // 2. Wait the exact amount of time to encode the bits
    await sleep(delayMs);

    // 3. Send REAL packet with the spatial payload
    const response = await fetch('/api/covert-sync', {
        method: 'GET',
        headers: headers
    });

    return response.json();
}
