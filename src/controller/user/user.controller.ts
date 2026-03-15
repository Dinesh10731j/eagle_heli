import { Request, Response } from "express";
import { UserPayload } from "../../dto/interface";
import { AppDataSource } from "../../configs/psqlDb.config";
import { User } from "../../entities/user.entity";
import { getCache, setCache } from "../../utils/helpers/redis_helper";
import { HTTP_STATUS } from "../../constant/statusCode.interface";
import { Message } from "../../constant/message.interface";

export class UserController {
  static async getMe(req: Request, res: Response) {
    const user = (req as Request & { user?: UserPayload }).user;
    if (!user) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: Message.UNAUTHORIZED });
    return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, data: user });
  }

  static async getAllUsers(req: Request, res: Response) {
    try {
      const cached = await getCache<any[]>("users:all");
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: true, data: cached.data });
      }
      const repo = AppDataSource.getRepository(User);
      const users = await repo.find({ select: ["id", "email", "name", "role"] });
      await setCache("users:all", users, 300);
      return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: false, data: users });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }
}
