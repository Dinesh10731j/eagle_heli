import express, { Application } from "express";
import router from "../routes/index.routes";
import cookieParser from "cookie-parser"
const createApp = (): Application => {
  const app = express();
  // Middlewares
  app.use(cookieParser())
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/v1/eagle-heli",router);

  return app;
};

export default createApp;