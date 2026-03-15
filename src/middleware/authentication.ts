import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserPayload } from "../dto/interface";
import { envConfig } from "../configs/env.config";
import { HTTP_STATUS } from "../constant/statusCode.interface";
import { Message } from "../constant/message.interface";
const {ACCESS_TOKEN_SECRET} = envConfig
export class VerifyToken {
  static authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.access_token || req.headers["authorization"]?.split(" ")[1];

      if (!token) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: Message.ACCESS_TOKEN_MISSING });
      }

      // jwt.verify returns string | object, so we need type guard
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET as string );
      if (
        typeof decoded !== "object" ||
        decoded === null ||
        !("id" in decoded) ||
        !("email" in decoded) ||
        !("role" in decoded)
      ) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: Message.INVALID_TOKEN_PAYLOAD });
      }

      // TypeScript now knows decoded has id & email
      (req as Request & { user?: UserPayload }).user = decoded as UserPayload;

      next();
    } catch (err) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: Message.INVALID_OR_EXPIRED_TOKEN });
    }
  }
}
