// backend/middleware/temporal_tracker.js
// Tracks incoming requests to extract Temporal Steganography bits based on time gaps.

const arrivalTimes = new Map();

function recordArrival(ip) {
    const now = Date.now();
    const lastTime = arrivalTimes.get(ip);
    arrivalTimes.set(ip, now);
    
    if (!lastTime) return null;
    
    const gap = now - lastTime;

    // Use 400ms buckets for high jitter tolerance
    // 00 = ~200ms
    // 01 = ~600ms
    // 10 = ~1000ms
    // 11 = ~1400ms
    if (gap >= 50 && gap <= 350) return '00';
    if (gap >= 450 && gap <= 750) return '01';
    if (gap >= 850 && gap <= 1150) return '10';
    if (gap >= 1250 && gap <= 1550) return '11';

    return null;
}

module.exports = { recordArrival };
