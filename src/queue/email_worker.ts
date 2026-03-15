import { Worker, Job } from "bullmq";
import nodemailer from "nodemailer";
import { emailBookingTemplate } from "../mailtemplate/booking_confirm";
import { bookingPendingTemplate } from "../mailtemplate/booking_pending";
import { bookingCancelledTemplate } from "../mailtemplate/booking_cancelled";
import { resetPasswordTemplate } from "../mailtemplate/reset_password";
import { replyResponseTemplate } from "../mailtemplate/reply_response";
import { newsLetterSubscribeTemplate } from "../mailtemplate/news_letter_subscribe";
import { newsLetterBroadcastTemplate } from "../mailtemplate/news_letter_broadcast";
import { envConfig } from "../configs/env.config";
import {
  EmailJobData,
  BookingEmailTemplateData,
  ResetPasswordTemplateData,
  ReplyEmailTemplateData,
  NewsLetterSubscribeTemplateData,
  NewsLetterBroadcastTemplateData,
} from "../dto/interface";
import { getRedisConnection } from "./bull_mq_configuration";
import chalk from "chalk";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = envConfig;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
  throw new Error("SMTP env variables are missing!");
}

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
    console.log(chalk.green("SMTP connection ready"));
  })
  .catch((err) => {
    console.error(chalk.red("SMTP connection error:"), err);
  });

export const emailWorker = new Worker<EmailJobData>(
  "emailQueue",
  async (job: Job<EmailJobData>) => {
    const { to, subject, templateData, templateType } = job.data;

    let html = "";
    if (templateType === "reset_password") {
      const data = templateData as ResetPasswordTemplateData;
      html = resetPasswordTemplate({
        name: data.name,
        resetLink: data.resetLink,
      });
    } else if (templateType === "reply") {
      const data = templateData as ReplyEmailTemplateData;
      html = replyResponseTemplate({
        name: data.name,
        message: data.message,
        ...(data.relatedTo ? { relatedTo: data.relatedTo } : {}),
      });
    } else if (templateType === "newsletter_subscribe") {
      const data = templateData as NewsLetterSubscribeTemplateData;
      html = newsLetterSubscribeTemplate({ email: data.email });
    } else if (templateType === "newsletter_broadcast") {
      const data = templateData as NewsLetterBroadcastTemplateData;
      html = newsLetterBroadcastTemplate({
        content: data.content,
        ...(data.title ? { title: data.title } : {}),
      });
    } else {
      const data = templateData as BookingEmailTemplateData;
      html =
        templateType === "cancelled"
          ? bookingCancelledTemplate({
              name: data.name,
              flightNumber: data.flightNumber,
            })
          : templateType === "pending"
          ? bookingPendingTemplate({
              name: data.name,
              flightNumber: data.flightNumber,
            })
          : emailBookingTemplate(data);
    }

    await transporter.sendMail({
      from: `"Eagle Heli" <${SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(chalk.blue(`Email sent to ${to}`));
  },
  {
    connection: getRedisConnection(),
  }
);

emailWorker.on("failed", (job, err) => {
  console.error(chalk.red("Email job failed"), { id: job?.id, err });
});

emailWorker.on("error", (err) => {
  console.error(chalk.red("Email worker error:"), err);
});
