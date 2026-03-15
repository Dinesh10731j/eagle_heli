import { Worker } from "bullmq";
import { getRedisConnection } from "./bull_mq_configuration";

export const userMetaDataWorker = new Worker(
  "userMetaDataQueue",
  async (job) => {
    console.log("User meta data job received", job.id);
  },
  { connection: getRedisConnection() }
);
