/**
 * ============================================================
 *  PEC COVERT LISTENER MIDDLEWARE
 *  Polymorphic ETag Cloaking Algorithm — Backend Interceptor
 *  NetraVaultOG | Application-Layer Steganography Engine
 * ============================================================
 *
 *  This Express middleware intercepts ALL incoming GET requests.
 *  It inspects the `ETag` and `X-Cache-Seed` headers.
 *
 *  If a valid PEC-encoded ETag is found:
 *    → It decodes the secret using the PEC decoder.
 *    → It logs the covert transmission to the console.
 *    → It saves the extracted secret to the database (optional).
 *    → It responds with a standard 200 OK (looks like a normal health check).
 *
 *  If no valid PEC ETag is found:
 *    → The request is passed through normally with next().
 *
 *  To firewalls and network monitors, this endpoint is completely
 *  invisible — it looks like a routine browser cache validation request.
 * ============================================================
 */

const { pecDecode } = require('../utils/pec_decoder');

/**
 * PEC Covert Listener Middleware
 * Mount this ONLY on the /api/system/ping route in server.js.
 */
const pecCovertListener = (req, res, next) => {
  const etagHeader    = req.headers['etag'];
  const cacheSeedHex  = req.headers['x-cache-seed'];

  // If no ETag header is present, pass the request through normally
  if (!etagHeader) {
    return next();
  }

  // Attempt to decode using PEC algorithm
  const result = pecDecode(etagHeader, cacheSeedHex);

  if (result.success) {
    // ── SUCCESSFUL COVERT TRANSMISSION DETECTED ──────────────────────────

    const logTime = new Date().toISOString();
    const clientIp = req.ip || req.connection?.remoteAddress || 'UNKNOWN';

    // Log the decoded secret to the server console
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║          [PEC] COVERT TRANSMISSION INTERCEPTED          ║');
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log(`║  Time    : ${logTime}`);
    console.log(`║  Client  : ${clientIp}`);
    console.log(`║  Secret  : ${result.secret}`);
    console.log(`║  Salt TS : ${result.timestamp || 'N/A'}`);
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    // ── RESPOND: Looks like a normal cache freshness response ────────────
    // 304 Not Modified = standard browser cache-hit response
    // This is exactly what a real server returns when an ETag matches.
    // It makes our covert channel look 100% legitimate to network monitors.
    return res.status(200).json({
      success: true,
      decoded: result.secret,
      timestamp: result.timestamp,
      status: 'PEC_RECEIVED',
      // Standard-looking cache response metadata
      cache: 'HIT',
      age: Math.floor(Math.random() * 3600),
    });

  } else {
    // ── DECODE FAILED: Could be a real browser, or malformed PEC ─────────
    // Log the failure quietly and pass through as a normal ping
    if (result.error !== 'INVALID_ETAG_FORMAT') {
      console.warn(`[PEC] Decode attempt failed: ${result.error} | ETag: ${etagHeader?.substring(0, 30)}...`);
    }

    // Fall through — respond as a normal health check
    return res.status(200).json({
      success: false,
      status: 'PING_OK',
      cache: 'MISS',
      uptime: process.uptime(),
    });
  }
};

module.exports = { pecCovertListener };
