// src/utils/covert_sync.js
import { encodeCovertTag } from "./crypto_helper";
import { TreeParityMachine, encodeOutputs, decodeOutputs } from "./tpm_crypto";
import { PROFILES, morphHeaders } from "./env_morpher";
import { sendTemporalPayload } from "./temporal_sender";

function bufferToBase64(buf) {
    let binary = '';
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

/**
 * Advanced Covert Payload Sender
 * Integrates TPM Neural Cryptography, Environment-Aware Morphing, and Spatial-Temporal Steganography.
 */
export async function sendAdvancedCovertPayload(dataString) {
    // 1. Initialize Neural Cryptography (TPM)
    const tpm = new TreeParityMachine(3, 50, 4, 12345);
    const clientOutputs = tpm.generateClientOutputs(500);
    const clientMatrixHex = encodeOutputs(clientOutputs);

    // 2. Fetch Token & Server TPM Outputs
    const tokenResp = await fetch("/api/covert-token", {
        headers: { 'x-telemetry-matrix': clientMatrixHex }
    });
    
    if (!tokenResp.ok) {
        throw new Error("Failed to negotiate covert token");
    }
    
    const { token, profile, tpmMatrix } = await tokenResp.json();

    // 3. Sync TPM Weights and Derive Key
    const serverOutputs = decodeOutputs(tpmMatrix, 500);
    tpm.syncClient(serverOutputs);
    const aesKeyBuffer = await tpm.getDerivedKey();
    const aesKeyBase64 = bufferToBase64(aesKeyBuffer);

    // 4. Encode Payload (We use the TPM key as the encryption secret)
    // Note: The original encodeCovertTag just encrypted timestamp+nonce.
    // To send actual data, we would append it, but we'll stick to the existing crypto signature for compatibility, 
    // passing the data as the secret (so it gets logged as the payload on backend).
    const etagStr = await encodeCovertTag(dataString, aesKeyBase64);

    // Convert "<ctB64>.<hmacB64>" to hex for morphing
    const payloadHex = Array.from(new TextEncoder().encode(etagStr))
                            .map(b => b.toString(16).padStart(2, '0'))
                            .join('');

    // 5. Morph Headers
    const { headers } = morphHeaders(profile, payloadHex, token);

    // 6. Transmit using Spatial-Temporal Hybrid Steganography
    const result = await sendTemporalPayload(token, headers, payloadHex);
    return result;
}
