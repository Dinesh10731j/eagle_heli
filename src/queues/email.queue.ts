import { Queue, ConnectionOptions } from "bullmq";
import { envConfig } from "../configs/env.config";

const { REDIS_URL } = envConfig;

if (!REDIS_URL) {
  throw new Error("REDIS_URL is missing!");
}

const getRedisConnection = (): ConnectionOptions => {
  const url = new URL(REDIS_URL);
  return {
    host: url.hostname,
    port: Number(url.port) || 6379,
    username: url.username || undefined,
    password: url.password || undefined,
    tls: url.protocol === "rediss:" ? {} : undefined,
  };
};

export const emailQueue = new Queue("emailQueue", {
  connection: getRedisConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
