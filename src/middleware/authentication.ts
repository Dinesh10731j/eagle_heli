import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserPayload } from "../dto/interface";
import { envConfig } from "../configs/env.config";
const {ACCESS_TOKEN_SECRET} = envConfig
export class VerifyToken {
  static authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.access_token || req.headers["authorization"]?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Access token missing. Please login!" });
      }

      // jwt.verify returns string | object, so we need type guard
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET as string );
      if (typeof decoded !== "object" || decoded === null || !("id" in decoded) || !("email" in decoded)) {
        return res.status(401).json({ message: "Invalid token payload" });
      }

      // TypeScript now knows decoded has id & email
      req.user = decoded as UserPayload

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token. Please login!" });
    }
  }
}