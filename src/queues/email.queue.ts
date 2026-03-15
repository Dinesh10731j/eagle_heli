import { Queue } from "bullmq";
import { getRedisConnection } from "../queue/bull_mq_configuration";

type EmailQueueLike = Pick<Queue, "add">;

const createRealQueue = () =>
  new Queue("emailQueue", {
    connection: getRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
      removeOnComplete: true,
      removeOnFail: false,
    },
  });

const noopQueue: EmailQueueLike = {
  add: async () => ({} as any),
};

export const emailQueue: EmailQueueLike =
  process.env.SKIP_REDIS === "true" ? noopQueue : createRealQueue();
