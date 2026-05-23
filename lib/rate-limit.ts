// ============================================================
// SpendLens — Upstash Rate Limiters
// Gracefully disabled when env vars are not set
// ============================================================

let auditRateLimit: any = null;
let leadRateLimit: any = null;

// Lazy-initialize to avoid errors when env vars are missing
function getAuditRateLimit() {
  if (!auditRateLimit) {
    try {
      const { Ratelimit } = require('@upstash/ratelimit');
      const { Redis } = require('@upstash/redis');
      if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        const redis = Redis.fromEnv();
        auditRateLimit = new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(20, '1 h'),
          prefix: 'rl:audit',
        });
      }
    } catch {
      // Upstash not available — rate limiting disabled
    }
  }
  return auditRateLimit;
}

function getLeadRateLimit() {
  if (!leadRateLimit) {
    try {
      const { Ratelimit } = require('@upstash/ratelimit');
      const { Redis } = require('@upstash/redis');
      if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        const redis = Redis.fromEnv();
        leadRateLimit = new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(5, '1 h'),
          prefix: 'rl:lead',
        });
      }
    } catch {
      // Upstash not available — rate limiting disabled
    }
  }
  return leadRateLimit;
}

/** Check rate limit. Returns { allowed: true } when rate limiter is not configured. */
export async function checkAuditRateLimit(
  ip: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const limiter = getAuditRateLimit();
  if (!limiter) return { allowed: true };
  const { success, reset } = await limiter.limit(ip);
  if (!success) return { allowed: false, retryAfter: Math.ceil((reset - Date.now()) / 1000) };
  return { allowed: true };
}

export async function checkLeadRateLimit(
  ip: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const limiter = getLeadRateLimit();
  if (!limiter) return { allowed: true };
  const { success, reset } = await limiter.limit(ip);
  if (!success) return { allowed: false, retryAfter: Math.ceil((reset - Date.now()) / 1000) };
  return { allowed: true };
}
