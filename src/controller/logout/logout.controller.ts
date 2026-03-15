import { Request, Response } from "express";
import { HTTP_STATUS } from "../../constant/statusCode.interface";
import { Message } from "../../constant/message.interface";

export class LogoutController {
  static async logout(req: Request, res: Response) {
    try {
      res
        .clearCookie("access_token", {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        })
        .clearCookie("refresh_token", {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        })
        .status(HTTP_STATUS.OK)
        .json({ message: Message.SUCCESS });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }
}
