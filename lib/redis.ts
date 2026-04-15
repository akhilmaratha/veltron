import { createClient } from "redis";

type VeltronRedisClient = ReturnType<typeof createClient>;

declare global {
  var __veltronRedisClient: VeltronRedisClient | undefined;
  var __veltronRedisConnectPromise: Promise<VeltronRedisClient> | undefined;
}

export async function getRedisClient(): Promise<VeltronRedisClient | null> {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    return null;
  }

  if (global.__veltronRedisClient?.isOpen) {
    return global.__veltronRedisClient;
  }

  if (global.__veltronRedisConnectPromise) {
    return global.__veltronRedisConnectPromise;
  }

  const client = createClient({
    url: redisUrl,
  });

  client.on("error", (error) => {
    console.error("Redis client error:", error);
  });

  global.__veltronRedisClient = client;
  global.__veltronRedisConnectPromise = client.connect().then(() => client);

  try {
    return await global.__veltronRedisConnectPromise;
  } finally {
    global.__veltronRedisConnectPromise = undefined;
  }
}
