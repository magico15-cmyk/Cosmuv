import { NextRequest, NextResponse } from "next/server";

interface RateLimitRecord {
  count: number;
  startTime: number;
}

// In-memory sliding window store keyed by `${action}:${ip}`
const apiRateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Clean up expired rate limit records periodically
 */
function cleanupExpiredRecords(windowMs: number) {
  const now = Date.now();
  for (const [key, record] of apiRateLimitMap.entries()) {
    if (now - record.startTime > windowMs) {
      apiRateLimitMap.delete(key);
    }
  }
}

export interface RateLimitOptions {
  action: string;
  maxRequests?: number; // Default: 20 requests per window
  windowMs?: number; // Default: 1 minute (60000 ms)
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  error?: string;
}

/**
 * Evaluates rate limit for a specific IP address and action (e.g., 'order_creation', 'product_insertion', 'store_registration').
 * Blocks rapid spikes from automated scripts or abusive bots.
 */
export function checkApiRateLimit(reqOrIp: NextRequest | string, options: RateLimitOptions): RateLimitResult {
  const maxRequests = options.maxRequests ?? 20;
  const windowMs = options.windowMs ?? 60 * 1000; // 1 minute window
  const action = options.action || "default_mutation";

  cleanupExpiredRecords(windowMs);

  let ip = "unknown_ip";
  if (typeof reqOrIp === "string") {
    ip = reqOrIp;
  } else {
    ip =
      reqOrIp.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      reqOrIp.headers.get("x-real-ip") ||
      "unknown_ip";
  }

  const key = `${action}:${ip}`;
  const now = Date.now();
  let record = apiRateLimitMap.get(key);

  if (!record || now - record.startTime > windowMs) {
    record = {
      count: 1,
      startTime: now,
    };
    apiRateLimitMap.set(key, record);
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: record.startTime + windowMs,
    };
  }

  record.count += 1;
  apiRateLimitMap.set(key, record);

  const resetTime = record.startTime + windowMs;
  const remaining = Math.max(0, maxRequests - record.count);

  if (record.count > maxRequests) {
    const secondsLeft = Math.ceil((resetTime - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetTime,
      error: `Too many requests for ${action.replace(/_/g, " ")}. Upstream rate limit exceeded to protect system stability. Please wait ${secondsLeft} seconds before trying again.`,
    };
  }

  return {
    allowed: true,
    remaining,
    resetTime,
  };
}

/**
 * Higher-order API Route Middleware for Upstream Abuse Protection.
 * Wraps write/mutation API endpoints (order creation, product insertion, merchant registration) to enforce strict rate limits.
 */
export function withApiRateLimit(
  handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse> | NextResponse,
  options: RateLimitOptions
) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse> => {
    // We only rate-limit write/mutation methods or if explicitly specified
    const method = req.method.toUpperCase();
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method) || options.action) {
      const result = checkApiRateLimit(req, options);

      if (!result.allowed) {
        console.warn(`[UPSTREAM ABUSE BLOCKED] IP exceeded rate limit for action [${options.action}]`);
        return NextResponse.json(
          { error: result.error || "Rate limit exceeded. Please slow down." },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": String(options.maxRequests ?? 20),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": String(Math.ceil(result.resetTime / 1000)),
              "Retry-After": String(Math.ceil((result.resetTime - Date.now()) / 1000)),
            },
          }
        );
      }

      // Attach rate limit headers to successful response
      const response = await handler(req, ...args);
      response.headers.set("X-RateLimit-Limit", String(options.maxRequests ?? 20));
      response.headers.set("X-RateLimit-Remaining", String(result.remaining));
      response.headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetTime / 1000)));
      return response;
    }

    return await handler(req, ...args);
  };
}
