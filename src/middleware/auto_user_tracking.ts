import { Request, Response, NextFunction } from "express";

export const autoUserTracking = (req: Request, _res: Response, next: NextFunction) => {
  req.headers["x-client-ip"] = req.ip;
  req.headers["x-user-agent"] = req.get("user-agent") || "";
  next();
};
