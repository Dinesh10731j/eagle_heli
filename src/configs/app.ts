import express, { Application } from "express";
import router from "../routes/index.routes";
import cookieParser from "cookie-parser"
import cors from "cors";
import { apiRateLimiter } from "../middleware/rate_limiting";
import { autoUserTracking } from "../middleware/auto_user_tracking";
import { HTTP_STATUS } from "../constant/statusCode.interface";
import { Message } from "../constant/message.interface";
import { httpLogger } from "../utils/logger";
const createApp = (): Application => {
  const app = express();
  // Middlewares
  app.use(cookieParser())
  app.use(httpLogger);
  app.use(cors({ origin: true, credentials: true }));
  app.use(apiRateLimiter);
  app.use(autoUserTracking);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (_req, res) => res.status(HTTP_STATUS.OK).json({ status: Message.HEALTH_OK }));

  app.use("/api/v1/eagle-heli",router);

  return app;
};

export default createApp;
