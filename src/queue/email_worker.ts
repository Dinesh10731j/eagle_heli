import { Worker, Job } from "bullmq";
import nodemailer from "nodemailer";
import { emailBookingTemplate } from "../mailtemplate/booking_confirm";
import { ConnectionOptions } from "bullmq";
import { envConfig } from "../configs/env.config";
import { EmailJobData } from "../dto/interface";

const { REDIS_URL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = envConfig;

if (!REDIS_URL) {
  throw new Error("REDIS_URL is missing!");
}

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
  throw new Error("SMTP env variables are missing!");
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

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465,
  pool: true,
  maxConnections: 3,
  maxMessages: 100,
  connectionTimeout: 20_000,
  greetingTimeout: 20_000,
  socketTimeout: 30_000,
  requireTLS: Number(SMTP_PORT) === 587,
  tls: {
    minVersion: "TLSv1.2",
  },
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

transporter
  .verify()
  .then(() => {
    console.log("SMTP connection ready");
  })
  .catch((err) => {
    console.error("SMTP connection error:", err);
  });

export const emailWorker = new Worker<EmailJobData>(
  "emailQueue",
  async (job: Job<EmailJobData>) => {
    const { to, subject, templateData } = job.data;

    await transporter.sendMail({
      from: `"Eagle Heli" <${SMTP_USER}>`,
      to,
      subject,
      html: emailBookingTemplate(templateData),
    });

    console.log(`Email sent to ${to}`);
  },
  {
    connection: getRedisConnection(),
  }
);

emailWorker.on("failed", (job, err) => {
  console.error("Email job failed", { id: job?.id, err });
});

emailWorker.on("error", (err) => {
  console.error("Email worker error:", err);
});
