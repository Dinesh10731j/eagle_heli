import { Request, Response, NextFunction } from "express";
import { envConfig } from "../configs/env.config";
import { HTTP_STATUS } from "../constant/statusCode.interface";
import { Message } from "../constant/message.interface";

export const verifyCaptcha = async (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== "production" && process.env.RECAPTCHA_DISABLED !== "false") {
    return next();
  }
  if (process.env.RECAPTCHA_DISABLED === "true") return next();

  const token =
    req.body?.captchaToken ||
    req.body?.recaptchaToken ||
    req.headers["x-captcha-token"];

  if (!token || typeof token !== "string") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: Message.CAPTCHA_REQUIRED });
  }

  const secret = envConfig.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
  }

  try {
    const body = new URLSearchParams({
      secret,
      response: token,
    });

    const resp = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const data = (await resp.json()) as { success?: boolean };
    if (!data.success) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: Message.CAPTCHA_FAILED });
    }

    return next();
  } catch {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: Message.CAPTCHA_FAILED });
  }
};
