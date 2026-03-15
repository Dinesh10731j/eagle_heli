import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateSeoMetaDataDTO } from "../../dto/seo_meta_data/seo_meta_data.dto";
import { SeoMetaDataRepository } from "../../repository/seo_meta_data/seo_meta_data.repository";
import { SeoMetaDataService } from "../../service/seo_meta_data/seo_meta_data.service";
import { getCache, setCache, delCache } from "../../utils/helpers/redis_helper";
import { HTTP_STATUS } from "../../constant/statusCode.interface";
import { Message } from "../../constant/message.interface";

const seoMetaRepo = new SeoMetaDataRepository();
const seoMetaService = new SeoMetaDataService(seoMetaRepo);

export class SeoMetaDataController {
  static async createSeoMetaData(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateSeoMetaDataDTO, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);

      const result = await seoMetaService.createSeoMetaData(dto);
      if (!result.data) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await delCache("seoMeta:all");
      return res.status(result.status).json({ message: Message.CREATED, data: result.data });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async getAllSeoMetaData(req: Request, res: Response) {
    try {
      const cached = await getCache<any[]>("seoMeta:all");
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: true, data: cached.data });
      }
      const result = await seoMetaService.getAllSeoMetaData();
      if (!result.data) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await setCache("seoMeta:all", result.data, 300);
      return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: false, data: result.data });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async getSeoMetaDataById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cacheKey = `seoMeta:${id}`;
      const cached = await getCache<any>(cacheKey);
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: true, data: cached.data });
      }
      const result = await seoMetaService.getSeoMetaDataById(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND || !result.data) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await setCache(cacheKey, result.data, 300);
      return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: false, data: result.data });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async updateSeoMetaData(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto = plainToInstance(CreateSeoMetaDataDTO, req.body);
      const errors = await validate(dto, { skipMissingProperties: true });
      if (errors.length > 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);

      const result = await seoMetaService.updateSeoMetaData(Number(id), dto);
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await delCache("seoMeta:all");
      await delCache(`seoMeta:${id}`);
      return res.status(HTTP_STATUS.OK).json({ message: Message.UPDATED, data: result.data });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async deleteSeoMetaData(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await seoMetaService.deleteSeoMetaData(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await delCache("seoMeta:all");
      await delCache(`seoMeta:${id}`);
      return res.status(HTTP_STATUS.OK).json({ message: Message.DELETED });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }
}
