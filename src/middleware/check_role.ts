import { Request, Response, NextFunction } from "express";
import { UserPayload } from "../dto/interface";
import { HTTP_STATUS } from "../constant/statusCode.interface";
import { Message } from "../constant/message.interface";

const forbidden = (res: Response) =>
  res.status(HTTP_STATUS.FORBIDDEN).json({ message: Message.FORBIDDEN_ROLE });

export class CheckRole {
  static isVerifiedUser(req: Request, res: Response, next: NextFunction) {
    const user = (req as Request & { user?: UserPayload }).user;
    if (!user) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: Message.UNAUTHORIZED });
    if (!user.isVerified) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ message: Message.FORBIDDEN });
    }
    return next();
  }

  static isAdmin(req: Request, res: Response, next: NextFunction) {
    const user = (req as Request & { user?: UserPayload }).user;
    if (!user) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: Message.UNAUTHORIZED });
    if (user.role !== "admin" && user.role !== "sudo_admin") {
      return forbidden(res);
    }
    return next();
  }

  static isSudoAdmin(req: Request, res: Response, next: NextFunction) {
    const user = (req as Request & { user?: UserPayload }).user;
    if (!user) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: Message.UNAUTHORIZED });
    if (user.role !== "sudo_admin") {
      return forbidden(res);
    }
    return next();
  }

  static isAdminOrSudoAdmin(req: Request, res: Response, next: NextFunction) {
    return CheckRole.isAdmin(req, res, next);
  }
}
