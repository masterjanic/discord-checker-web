import { type NextRequest } from "next/server";

import { db } from "~/server/db";
import { redis } from "~/server/redis/client";

export class ApiMiddlewareError extends Error {
  cause: number | undefined;
  headers: Record<string, string> | undefined;

  constructor(
    message: string,
    { cause, headers }: { cause?: number; headers?: Record<string, string> },
  ) {
    super(message);
    this.cause = cause;
    this.headers = headers;
  }
}

export const apiMiddleware = async (request: NextRequest) => {
  const key = request.headers.get("Authorization");
  if (!key) {
    throw new ApiMiddlewareError("No API key provided.", { cause: 401 });
  }

  const apiKey = await db.apiKey.findUnique({
    where: {
      value: key,
    },
    select: {
      userId: true,
      allowedIps: true,
      expiresAt: true,
      rateLimit: true,
    },
  });
  if (!apiKey) {
    throw new ApiMiddlewareError("The provided API key is invalid.", {
      cause: 401,
    });
  }

  const now = Date.now();
  if (apiKey.expiresAt && apiKey.expiresAt.getTime() < now) {
    throw new ApiMiddlewareError("The provided API key has expired.", {
      cause: 401,
    });
  }

  // Restore original IP from Cloudflare headers
  const ip = request.headers.get("CF-Connecting-IP");
  if (!ip || !apiKey.allowedIps.includes(ip)) {
    throw new ApiMiddlewareError(
      "The requesting IP address is not whitelisted.",
      {
        cause: 403,
      },
    );
  }

  const cacheKey = `api-key:${key}:rate-limit`;
  const currentCount = (await redis.get(cacheKey)) ?? 0;

  if (Number(currentCount) > apiKey.rateLimit) {
    throw new ApiMiddlewareError("Rate limit exceeded.", {
      cause: 429,
      headers: {
        "X-RateLimit-Reset": "60",
        "Retry-After": "60",
        "X-RateLimit-Limit": apiKey.rateLimit.toString(),
        "X-RateLimit-Remaining": "0",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
    });
  }

  await redis.incr(cacheKey);
  await redis.expire(cacheKey, 60);

  return {
    userId: apiKey.userId,
    headers: {
      "X-RateLimit-Limit": apiKey.rateLimit.toString(),
      "X-RateLimit-Remaining": (
        apiKey.rateLimit - Number(currentCount)
      ).toString(),
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    },
  };
};
