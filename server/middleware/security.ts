import { Request, Response, NextFunction } from 'express';

// 1. Security Headers Middleware (Zero-dependency Helmet alternative)
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Protect against MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Protect against Clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Legacy XSS protection filter
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // HTTP Strict Transport Security (HSTS)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  res.setHeader('Permissions-Policy', 'geolocation=(self), camera=(), microphone=(), payment=()');
  
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: https: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://generativelanguage.googleapis.com;"
  );

  // Remove X-Powered-By header to obscure backend tech stack
  res.removeHeader('X-Powered-By');

  next();
}

// 2. Sliding Window Rate Limiter Middleware
interface RateLimitRecord {
  timestamps: number[];
}

export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}) {
  const store = new Map<string, RateLimitRecord>();
  const { windowMs, max, message = 'Too many requests, please try again later.', keyGenerator } = options;

  // Periodic cleanup of expired records every 5 minutes
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      record.timestamps = record.timestamps.filter(ts => now - ts < windowMs);
      if (record.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }, Math.min(windowMs, 300000));
  
  if (cleanupTimer.unref) {
    cleanupTimer.unref();
  }

  return (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'test') {
      return next();
    }
    const key = keyGenerator ? keyGenerator(req) : (req.ip || req.socket.remoteAddress || 'unknown-client');
    const now = Date.now();
    
    let record = store.get(key);
    if (!record) {
      record = { timestamps: [] };
      store.set(key, record);
    }

    // Retain only requests within current window
    record.timestamps = record.timestamps.filter(ts => now - ts < windowMs);

    if (record.timestamps.length >= max) {
      const oldest = record.timestamps[0];
      const retryAfter = Math.ceil((windowMs - (now - oldest)) / 1000);
      res.setHeader('Retry-After', retryAfter.toString());
      res.setHeader('X-RateLimit-Limit', max.toString());
      res.setHeader('X-RateLimit-Remaining', '0');
      return res.status(429).json({
        success: false,
        error: message,
        retryAfterSeconds: retryAfter
      });
    }

    record.timestamps.push(now);
    res.setHeader('X-RateLimit-Limit', max.toString());
    res.setHeader('X-RateLimit-Remaining', (max - record.timestamps.length).toString());

    next();
  };
}

// Preconfigured Limiters
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // max 30 auth attempts per 15 min per IP
  message: 'Too many authentication attempts. Please try again after 15 minutes.'
});

export const aiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // max 100 AI requests per minute per client
  message: 'AI rate limit reached. Please wait a moment before requesting further suggestions.'
});

export const generalApiLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 180, // max 180 requests per minute
  message: 'High traffic detected. Please slow down your requests.'
});
