/**
 * Rate Limiting Middleware
 * Prevents abuse by limiting requests per IP
 */

const requestCounts = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Max requests per window

const cleanupOldEntries = () => {
  const now = Date.now();
  for (const [ip, data] of requestCounts.entries()) {
    if (now - data.resetTime > WINDOW_MS) {
      requestCounts.delete(ip);
    }
  }
};

export const rateLimit = (req, res, next) => {
  cleanupOldEntries();

  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, resetTime: now });
    return next();
  }

  const data = requestCounts.get(ip);

  if (now - data.resetTime > WINDOW_MS) {
    // Reset window
    requestCounts.set(ip, { count: 1, resetTime: now });
    return next();
  }

  data.count++;

  if (data.count > MAX_REQUESTS) {
    return res.status(429).json({
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((data.resetTime + WINDOW_MS - now) / 1000),
    });
  }

  res.set('X-RateLimit-Limit', MAX_REQUESTS);
  res.set('X-RateLimit-Remaining', MAX_REQUESTS - data.count);
  res.set('X-RateLimit-Reset', new Date(data.resetTime + WINDOW_MS).toISOString());

  next();
};
