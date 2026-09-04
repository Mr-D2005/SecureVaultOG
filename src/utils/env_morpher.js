/**
 * Environment-Aware Traffic Morpher
 * Generates decoy headers to mimic legitimate traffic profiles (YouTube, MS Teams, AWS).
 * The covert payload is injected into a specific header depending on the profile.
 */

function hexToBase64(hexStr) {
    let binary = '';
    for (let i = 0; i < hexStr.length; i += 2) {
        binary += String.fromCharCode(parseInt(hexStr.substr(i, 2), 16));
    }
    return btoa(binary);
}

function base64ToHex(b64) {
    const raw = atob(b64);
    let result = '';
    for (let i = 0; i < raw.length; i++) {
        const hex = raw.charCodeAt(i).toString(16);
        result += (hex.length === 2 ? hex : '0' + hex);
    }
    return result;
}

export const PROFILES = {
    STANDARD_APACHE: 'standard_apache',
    YOUTUBE_TELEMETRY: 'youtube_telemetry',
    MS_TEAMS_SYNC: 'ms_teams_sync'
};

export function morphHeaders(profile, payloadHex, token) {
    let headers = {
        'Cache-Control': 'no-cache',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    };
    let payloadKey = 'ETag';
    let formattedPayload = payloadHex;

    switch (profile) {
        case PROFILES.YOUTUBE_TELEMETRY:
            // YouTube playback telemetry mimicry
            headers['X-YouTube-Client-Name'] = '1';
            headers['X-YouTube-Client-Version'] = '2.20260522.01.00';
            headers['X-YouTube-Device'] = 'desktop';
            
            // YouTube nonces are usually base64/url-safe random strings. 
            // We format our hex payload to look like a nonce.
            payloadKey = 'X-Goog-Playback-Nonce';
            formattedPayload = 'v-' + hexToBase64(payloadHex).replace(/=/g, '');
            if (token) headers['X-Goog-Session-Id'] = token;
            break;

        case PROFILES.MS_TEAMS_SYNC:
            // Microsoft Teams sync mimicry
            headers['x-ms-client-version'] = '1415/1.0.0.20260522';
            headers['x-ms-session-id'] = '8d9a3b2c-1f2a-4b3c-9d8e-7f6a5b4c3d2e';
            headers['x-ms-scenario-id'] = '233';
            
            payloadKey = 'x-ms-correlation-id';
            // Teams correlation IDs are UUIDs. We can format our hex as a UUID if it fits,
            // but if it's large, we just send it as a long hex string mimicking a large tracking ID.
            formattedPayload = payloadHex.substring(0, 8) + '-' + 
                               payloadHex.substring(8, 12) + '-' + 
                               payloadHex.substring(12, 16) + '-' + 
                               payloadHex.substring(16, 20) + '-' + 
                               payloadHex.substring(20);
            if (token) headers['x-ms-client-request-id'] = token;
            break;

        case PROFILES.STANDARD_APACHE:
        default:
            // Standard Apache ETag mimicry (W/"inode-size-mtime")
            payloadKey = 'ETag';
            const third = Math.ceil(payloadHex.length / 3);
            const part1 = payloadHex.substring(0, third);
            const part2 = payloadHex.substring(third, third * 2);
            const part3 = payloadHex.substring(third * 2);
            formattedPayload = `W/"${part1}-${part2}-${part3}"`;
            if (token) headers['X-Request-Id'] = token;
            break;
    }

    headers[payloadKey] = formattedPayload;
    
    return {
        headers,
        payloadKey
    };
}

// Utility to un-morph the payload back to pure hex on the client/server
export function unmorphPayload(profile, formattedPayload) {
    if (!formattedPayload) return null;

    switch (profile) {
        case PROFILES.YOUTUBE_TELEMETRY:
            // Strip 'v-' and convert base64 back to hex
            let b64 = formattedPayload.substring(2);
            // Re-pad base64 if needed
            while (b64.length % 4 !== 0) b64 += '=';
            return base64ToHex(b64);

        case PROFILES.MS_TEAMS_SYNC:
            // Strip hyphens
            return formattedPayload.replace(/-/g, '');

        case PROFILES.STANDARD_APACHE:
        default:
            // Extract from W/"part1-part2-part3"
            let extracted = formattedPayload.replace('W/"', '').replace('"', '');
            return extracted.replace(/-/g, '');
    }
}
