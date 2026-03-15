import { emailQueue } from "../queues/email.queue";
import { EmailJobData } from "../dto/interface";

export const enqueueEmail = async (data: EmailJobData) => {
  return emailQueue.add("sendEmail", data);
};
