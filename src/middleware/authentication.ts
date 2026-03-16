import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserPayload } from "../dto/interface";
import { envConfig } from "../configs/env.config";
import { HTTP_STATUS } from "../constant/statusCode.interface";
import { Message } from "../constant/message.interface";
import { AppDataSource } from "../configs/psqlDb.config";
import { User } from "../entities/user.entity";
const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = envConfig
export class VerifyToken {
  static async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.access_token || req.headers["authorization"]?.split(" ")[1];

      if (!token) {
        const refreshToken = req.cookies?.refresh_token;
        if (!refreshToken) {
          return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: Message.ACCESS_TOKEN_MISSING });
        }

        const refreshDecoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET as string);
        if (
          typeof refreshDecoded !== "object" ||
          refreshDecoded === null ||
          !("id" in refreshDecoded)
        ) {
          return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: Message.INVALID_OR_EXPIRED_TOKEN });
        }

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { id: Number((refreshDecoded as any).id) } });
        if (!user) {
          return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: Message.INVALID_OR_EXPIRED_TOKEN });
        }

        const accessToken = jwt.sign(
          {
            id: user.id,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            name: user.name,
          },
          ACCESS_TOKEN_SECRET as string,
          { expiresIn: "15m" }
        );

        res.cookie("access_token", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 15 * 60 * 1000,
        });

        (req as Request & { user?: UserPayload }).user = {
          id: user.id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          name: user.name,
        };

        return next();
      }

      // jwt.verify returns string | object, so we need type guard
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET as string );
      if (
        typeof decoded !== "object" ||
        decoded === null ||
        !("id" in decoded) ||
        !("email" in decoded) ||
        !("role" in decoded) ||
        !("isVerified" in decoded) ||
        !("name" in decoded)
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
