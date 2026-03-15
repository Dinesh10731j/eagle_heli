import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateSeoDTO } from "../../dto/seo/seo.dto";
import { SeoRepository } from "../../repository/seo/seo.repository";
import { SeoService } from "../../service/seo/seo.service";
import { getCache, setCache, delCache } from "../../utils/helpers/redis_helper";
import { HTTP_STATUS } from "../../constant/statusCode.interface";
import { Message } from "../../constant/message.interface";

const seoRepo = new SeoRepository();
const seoService = new SeoService(seoRepo);

export class SeoController {
  static async createSeo(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateSeoDTO, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);

      const result = await seoService.createSeo(dto);
      if (!result.data) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await delCache("seo:all");
      return res.status(result.status).json({ message: Message.CREATED, data: result.data });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async getAllSeo(req: Request, res: Response) {
    try {
      const cached = await getCache<any[]>("seo:all");
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: true, data: cached.data });
      }
      const result = await seoService.getAllSeo();
      if (!result.data) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await setCache("seo:all", result.data, 300);
      return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: false, data: result.data });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async getSeoById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cacheKey = `seo:${id}`;
      const cached = await getCache<any>(cacheKey);
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: true, data: cached.data });
      }
      const result = await seoService.getSeoById(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND || !result.data) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await setCache(cacheKey, result.data, 300);
      return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: false, data: result.data });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async updateSeo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto = plainToInstance(CreateSeoDTO, req.body);
      const errors = await validate(dto, { skipMissingProperties: true });
      if (errors.length > 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);

      const result = await seoService.updateSeo(Number(id), dto);
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await delCache("seo:all");
      await delCache(`seo:${id}`);
      return res.status(HTTP_STATUS.OK).json({ message: Message.UPDATED, data: result.data });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async deleteSeo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await seoService.deleteSeo(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await delCache("seo:all");
      await delCache(`seo:${id}`);
      return res.status(HTTP_STATUS.OK).json({ message: Message.DELETED });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }
}
