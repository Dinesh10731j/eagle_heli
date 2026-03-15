import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateNewsLetterDTO, SendNewsLetterDTO } from "../../dto/news_letter/news_letter.dto";
import { NewsLetterRepository } from "../../repository/news_letter/news_letter.repository";
import { NewsLetterService } from "../../service/news_letter/news_letter.service";
import { getCache, setCache, delCache } from "../../utils/helpers/redis_helper";
import { HTTP_STATUS } from "../../constant/statusCode.interface";
import { Message } from "../../constant/message.interface";

const newsRepo = new NewsLetterRepository();
const newsService = new NewsLetterService(newsRepo);

export class NewsLetterController {
  static async createSubscription(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateNewsLetterDTO, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);

      const result = await newsService.createSubscription(dto);
      if (!result.data) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await delCache("newsLetter:all");
      return res.status(result.status).json({ message: Message.NEWSLETTER_SUBSCRIBED, data: result.data });
    } catch (err: any) {
      console.error("Newsletter create error:", err);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: Message.INTERNAL_SERVER_ERROR,
        ...(process.env.NODE_ENV !== "production" && { error: err?.message ?? String(err) }),
      });
    }
  }

  static async getAllSubscriptions(req: Request, res: Response) {
    try {
      const cached = await getCache<any[]>("newsLetter:all");
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: true, data: cached.data });
      }
      const result = await newsService.getAllSubscriptions();
      if (!result.data) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await setCache("newsLetter:all", result.data, 300);
      return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: false, data: result.data });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async getSubscriptionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cacheKey = `newsLetter:${id}`;
      const cached = await getCache<any>(cacheKey);
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: true, data: cached.data });
      }
      const result = await newsService.getSubscriptionById(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND || !result.data) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await setCache(cacheKey, result.data, 300);
      return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: false, data: result.data });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async deleteSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await newsService.deleteSubscription(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await delCache("newsLetter:all");
      await delCache(`newsLetter:${id}`);
      return res.status(HTTP_STATUS.OK).json({ message: Message.DELETED });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async sendNewsletter(req: Request, res: Response) {
    try {
      const dto = plainToInstance(SendNewsLetterDTO, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);

      const result = await newsService.sendNewsletter(dto);
      if (!result.data) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      return res.status(result.status).json({
        message: Message.NEWSLETTER_SENT,
        data: result.data,
      });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }
}
