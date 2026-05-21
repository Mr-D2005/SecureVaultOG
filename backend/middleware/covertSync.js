/*
  Covert Header Sync (CHS) middleware
  -------------------------------------------------
  This Express middleware reads a covert secret from the incoming request
  header (default: `etag`). It decodes the value using the reversible ETag
  algorithm defined in `src/utils/etag_algorithm.js` (shared between backend
  and frontend through a copy of the same logic).

  When the header is present and successfully decoded, the middleware adds
  `req.covertSecret` (the original secret) and `req.covertTimestamp` to the
  request object and calls `next()`. If the header is missing or malformed,
  it simply proceeds without attaching anything, allowing the request to be
  handled normally.

  The middleware is deliberately lightweight and does not send any response
  on its own – it is meant to be used on a dedicated endpoint (e.g.,
  `/api/covert-sync`) where the downstream handler can return the decoded
  secret to the client for verification.
*/

const { decodeETag } = require('../utils/etag_algorithm'); // backend copy of algorithm

/**
 * CovertHeaderSync middleware
 * @param {object} options – optional configuration:
 *   headerName: name of the incoming header containing the encoded value
 *               (default: 'etag')
 */
function covertHeaderSync(options = {}) {
  const headerName = (options.headerName || 'etag').toLowerCase();
  return (req, res, next) => {
    const rawHeader = req.headers[headerName];
    if (!rawHeader) {
      // No covert header – continue without attaching secret
      return next();
    }

    const result = decodeETag(rawHeader);
    if (result) {
      req.covertSecret = result.secret;
      req.covertTimestamp = result.timestamp;
      // Continue to downstream handler
      next();
    } else {
      // No valid secret, just continue
      next();
    }
  };
}

module.exports = covertHeaderSync;
