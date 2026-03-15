import { Request, Response, NextFunction } from "express";
import { AnalyticsRepository } from "../repository/analytics/analytics.repository";
import { AppDataSource } from "../configs/psqlDb.config";
import { CreateAnalyticsDTO } from "../dto/analytics/analytics.dto";

export const autoUserTracking = (req: Request, _res: Response, next: NextFunction) => {
  req.headers["x-client-ip"] = req.ip;
  req.headers["x-user-agent"] = req.get("user-agent") || "";

  if (process.env.NODE_ENV !== "test" && process.env.ENABLE_ANALYTICS !== "false") {
    const isHealth = req.originalUrl === "/health";
    const isAuthRoute = req.originalUrl.startsWith("/api/v1/eagle-heli/auth");
    if (!isHealth && !isAuthRoute && AppDataSource.isInitialized) {
      const event = req.method === "GET" ? "page_view" : "api_call";
      const path = req.originalUrl || req.path;
      const referrer = req.get("referer") || req.get("referrer") || undefined;
      const userAgent = req.get("user-agent") || undefined;
      const ip = req.ip;

      setImmediate(async () => {
        try {
          const payload: CreateAnalyticsDTO = { event, path };
          if (referrer) payload.referrer = referrer;
          if (userAgent) payload.userAgent = userAgent;
          if (ip) payload.ip = ip;

          const analyticsRepo = new AnalyticsRepository();
          await analyticsRepo.createAnalytics(payload);
        } catch {
          // swallow analytics errors to avoid impacting requests
        }
      });
    }
  }

  next();
};
