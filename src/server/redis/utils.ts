import { redis } from "~/server/redis/client";

/**
 * Returns a cached value from Redis in JSON format.
 * @param key
 */
const getCached = async <T>(key: string) => {
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
 * @param ttl Time to live in seconds.
 */
const setCached = async <T>(
  key: string,
  value: T,
  ttl?: number,
): Promise<"OK"> => {
  if (redis.status !== "ready") {
    return "OK";
  }

  return redis.set(key, JSON.stringify(value), "EX", ttl ?? 60);
};

/**
 * Fetches a value from Redis if it exists, otherwise fetches it from the given method and caches it.
 * @param key
 * @param fetch
 * @param ttl Time to live in seconds.
 */
export const fetchCached = async <T>(
  key: string,
  fetch: () => Promise<T> | T,
  ttl?: number,
) => {
  const cached = await getCached<T>(key);
  if (cached) {
    return cached;
  }

  const value = await fetch();
  await setCached(key, value, ttl);

  return value;
};
