/**
 * Simple rate limiting middleware
 * In production, use redis-based rate limiting
 */

const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per window

/**
 * Rate limiter middleware
 */
export const rateLimiter = (maxRequests = RATE_LIMIT_MAX_REQUESTS, windowMs = RATE_LIMIT_WINDOW) => {
  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    // Clean up old entries
    if (requestCounts.size > 10000) {
      requestCounts.clear();
    }

    // Get or create request count for this client
    let clientData = requestCounts.get(clientId);

    if (!clientData || now - clientData.resetTime > windowMs) {
      // Reset or create new entry
      clientData = {
        count: 1,
        resetTime: now + windowMs
      };
      requestCounts.set(clientId, clientData);
      return next();
    }

    // Increment count
    clientData.count++;

    // Check if limit exceeded
    if (clientData.count > maxRequests) {
      const retryAfter = Math.ceil((clientData.resetTime - now) / 1000);
      return res.status(429).json({
        success: false,
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Please try again after ${retryAfter} seconds.`,
        retryAfter
      });
    }

    next();
  };
};

/**
 * Strict rate limiter for sensitive endpoints (auth, upload)
 */
export const strictRateLimiter = rateLimiter(10, 15 * 60 * 1000); // 10 requests per 15 minutes


