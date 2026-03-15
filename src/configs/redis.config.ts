import Redis, { Redis as RedisClient } from "ioredis";
import { envConfig } from "./env.config";

const { REDIS_URL } = envConfig;

if (!REDIS_URL) {
  throw new Error("REDIS_URL is not defined in your environment variables!");
}

/**
 * RedisService is a type-safe wrapper around ioredis
 */
export class RedisService {
  private client: RedisClient;

  constructor(url: string) {
    this.client = new Redis(url, { maxRetriesPerRequest: null });

    this.client.on("connect", () => {
      console.log("Redis connected");
    });

    this.client.on("error", (err) => {
      console.error("Redis connection error:", err);
    });
  }

  /**
   * Get a value from Redis
   * @param key string
   * @returns string | null
   */
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /**
   * Set a value in Redis
   * @param key string
   * @param value string
   * @param ttl optional time to live in seconds
   */
  async set(key: string, value: string, ttl?: number): Promise<"OK"> {
    if (ttl) {
      return this.client.set(key, value, "EX", ttl);
    }
    return this.client.set(key, value);
  }

  /**
   * Delete a key from Redis
   * @param key string
   */
  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  /**
   * Access the raw Redis client if needed
   */
  getRawClient(): RedisClient {
    return this.client;
  }

  /**
   * Gracefully disconnect
   */
  async disconnect(): Promise<void> {
    await this.client.quit();
  }
}

// Export a singleton instance for app-wide use
export const redisService = new RedisService(REDIS_URL);
