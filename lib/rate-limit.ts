import { getRedisClient } from "@/lib/redis";

export interface RateLimitOptions {
  keyPrefix: string;
  identifier: string;
  limit: number;
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (!forwardedFor) {
    return "unknown";
  }

  return forwardedFor.split(",")[0]?.trim() || "unknown";
}

export function getRateLimitIdentifier(request: Request): string {
  return getClientIp(request);
}

export async function enforceRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const redis = await getRedisClient();

  if (!redis) {
    return {
      allowed: true,
      remaining: options.limit,
      retryAfterSeconds: 0,
    };
  }

  const scope = process.env.REDIS_PREFIX ?? "veltron";
  const key = `${scope}:ratelimit:${options.keyPrefix}:${options.identifier}`;

  try {
    const multi = redis.multi();
    multi.incr(key);
    multi.expire(key, options.windowSeconds, "NX");
    const results = await multi.exec();

    const countRaw = results?.[0];
    const count = typeof countRaw === "number" ? countRaw : Number(countRaw ?? 0);
    const remaining = Math.max(options.limit - count, 0);

    if (count > options.limit) {
      return {
        allowed: false,
        remaining,
        retryAfterSeconds: options.windowSeconds,
      };
    }

    return {
      allowed: true,
      remaining,
      retryAfterSeconds: 0,
    };
  } catch (error) {
    console.error("Rate limit error:", error);

    // Fail open so auth does not break if Redis is temporarily unavailable.
    return {
      allowed: true,
      remaining: options.limit,
      retryAfterSeconds: 0,
    };
  }
}
