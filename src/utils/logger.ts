import morgan from "morgan";
import chalk from "chalk";
import { Request, Response } from "express";

morgan.token("statusColor", (_req: Request, res: Response) => {
  const status = res.statusCode;
  if (status >= 500) return chalk.red(status.toString());
  if (status >= 400) return chalk.yellow(status.toString());
  if (status >= 300) return chalk.cyan(status.toString());
  return chalk.green(status.toString());
});

morgan.token("responseTime", (_req: Request, res: Response) => {
  const time = res.getHeader("x-response-time");
  return typeof time === "string" ? time : "-";
});

export const httpLogger = morgan(
  ":method :url :statusColor :res[content-length] - :response-time ms",
  {
    skip: (_req: Request) => process.env.NODE_ENV === "test",
  }
);
