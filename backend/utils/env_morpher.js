/**
 * Environment-Aware Traffic Morpher (Backend)
 */

const PROFILES = {
    STANDARD_APACHE: 'standard_apache',
    YOUTUBE_TELEMETRY: 'youtube_telemetry',
    MS_TEAMS_SYNC: 'ms_teams_sync'
};

// Utility to un-morph the payload back to pure hex on the server
function unmorphPayload(profile, headers) {
    let payloadKey = 'ETag';
    let formattedPayload = null;

    switch (profile) {
        case PROFILES.YOUTUBE_TELEMETRY:
            payloadKey = 'x-goog-playback-nonce'; // Express lowercases headers
            formattedPayload = headers[payloadKey];
            if (!formattedPayload) return null;
            
            // Strip 'v-' and convert base64 back to hex
            let b64 = formattedPayload.substring(2);
            while (b64.length % 4 !== 0) b64 += '=';
            return Buffer.from(b64, 'base64').toString('hex');

        case PROFILES.MS_TEAMS_SYNC:
            payloadKey = 'x-ms-correlation-id';
            formattedPayload = headers[payloadKey];
            if (!formattedPayload) return null;
            
            // Strip hyphens
            return formattedPayload.replace(/-/g, '');

        case PROFILES.STANDARD_APACHE:
        default:
            payloadKey = 'etag';
            formattedPayload = headers[payloadKey];
            if (!formattedPayload) return null;
            
            // Extract from W/"part1-part2-part3"
            let extracted = formattedPayload.replace('W/"', '').replace('"', '');
            return extracted.replace(/-/g, '');
    }
}

function extractToken(profile, headers) {
    switch (profile) {
        case PROFILES.YOUTUBE_TELEMETRY:
            return headers['x-goog-session-id'];
        case PROFILES.MS_TEAMS_SYNC:
            return headers['x-ms-client-request-id'];
        case PROFILES.STANDARD_APACHE:
        default:
            return headers['x-request-id'];
    }
}

module.exports = {
    PROFILES,
    unmorphPayload,
    extractToken
};
