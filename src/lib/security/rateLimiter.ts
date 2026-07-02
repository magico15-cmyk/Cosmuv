interface RateLimitEntry {
  attempts: number;
  firstAttemptTime: number;
  blockedUntil?: number;
}

// Global in-memory store for rate limiting across server worker invocations
const ipRateLimitMap = new Map<string, RateLimitEntry>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 15 * 60 * 1000; // Block for 15 minutes after 5 failed attempts

/**
 * Clean up expired rate limit entries to prevent memory leaks
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [ip, entry] of ipRateLimitMap.entries()) {
    if (entry.blockedUntil && now > entry.blockedUntil) {
      ipRateLimitMap.delete(ip);
    } else if (!entry.blockedUntil && now - entry.firstAttemptTime > WINDOW_MS) {
      ipRateLimitMap.delete(ip);
    }
  }
}

/**
 * Check if an IP address is currently allowed to make authentication attempts.
 */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  remainingAttempts: number;
  resetTime?: number;
  error?: string;
} {
  cleanupExpiredEntries();

  const now = Date.now();
  const entry = ipRateLimitMap.get(ip);

  if (!entry) {
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS,
    };
  }

  // Check if IP is currently blocked
  if (entry.blockedUntil && now < entry.blockedUntil) {
    const minutesLeft = Math.ceil((entry.blockedUntil - now) / 60000);
    return {
      allowed: false,
      remainingAttempts: 0,
      resetTime: entry.blockedUntil,
      error: `Too many unsuccessful authentication attempts. Your IP address has been temporarily blocked for security reasons. Please try again in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}.`,
    };
  }

  // If the 15-minute window expired without being blocked, reset
  if (now - entry.firstAttemptTime > WINDOW_MS) {
    ipRateLimitMap.delete(ip);
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS,
    };
  }

  const remaining = Math.max(0, MAX_ATTEMPTS - entry.attempts);
  return {
    allowed: remaining > 0,
    remainingAttempts: remaining,
  };
}

/**
 * Record a failed authentication attempt for an IP address.
 */
export function recordFailedAttempt(ip: string): { blocked: boolean; remainingAttempts: number } {
  const now = Date.now();
  let entry = ipRateLimitMap.get(ip);

  if (!entry || now - entry.firstAttemptTime > WINDOW_MS) {
    entry = {
      attempts: 1,
      firstAttemptTime: now,
    };
  } else {
    entry.attempts += 1;
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_DURATION_MS;
    ipRateLimitMap.set(ip, entry);
    return { blocked: true, remainingAttempts: 0 };
  }

  ipRateLimitMap.set(ip, entry);
  return { blocked: false, remainingAttempts: MAX_ATTEMPTS - entry.attempts };
}

/**
 * Reset failed attempts when login/signup succeeds.
 */
export function resetAttempts(ip: string): void {
  ipRateLimitMap.delete(ip);
}
