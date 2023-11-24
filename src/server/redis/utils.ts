import { redis } from "~/server/redis/client";

/**
 * Returns a cached value from Redis in JSON format.
 * @param key
 */
export const getCached = async <T>(key: string) => {
  if (redis.status !== "ready") {
    return null;
  }

  const cached = await redis.get(key);

  if (!cached) {
    return null;
  }

  return JSON.parse(cached) as T;
};

/**
 * Sets a value in Redis in JSON format.
 * @param key
 * @param value
 * @param ttl
 */
export const setCached = async <T>(
  key: string,
  value: T,
  ttl?: number,
): Promise<"OK"> => {
  if (redis.status !== "ready") {
    return "OK";
  }

  return redis.set(key, JSON.stringify(value), "EX", ttl ?? 60);
};
