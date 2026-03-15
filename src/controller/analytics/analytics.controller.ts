import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AnalyticsService } from "../../service/analytics/analytics.service";
import { AnalyticsRepository } from "../../repository/analytics/analytics.repository";
import { CreateAnalyticsDTO } from "../../dto/analytics/analytics.dto";
import { getCache, setCache, delCache } from "../../utils/helpers/redis_helper";
import { HTTP_STATUS } from "../../constant/statusCode.interface";
import { Message } from "../../constant/message.interface";
import { ServiceResult } from "../../types/service_result";
import { Analytics } from "../../entities/analytics.entity";

const analyticsRepo = new AnalyticsRepository();
const analyticsService = new AnalyticsService(analyticsRepo);

export class AnalyticsController {
  static async createAnalytics(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateAnalyticsDTO, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);

      const result: ServiceResult<Analytics> = await analyticsService.createAnalytics(dto);
      await delCache("analytics:all");

      if (result.status !== HTTP_STATUS.CREATED) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }

      return res.status(result.status).json({
        message: Message.CREATED,
        data: result.data,
      });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async getAllAnalytics(req: Request, res: Response) {
    try {
      const cached = await getCache<any[]>("analytics:all");
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({
          message: Message.FETCHED,
          isCached: true,
          data: cached.data,
        });
      }

      const result: ServiceResult<Analytics[]> = await analyticsService.getAllAnalytics();
      if (result.status !== HTTP_STATUS.OK) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await setCache("analytics:all", result.data, 300);
      return res.status(result.status).json({
        message: Message.FETCHED,
        isCached: false,
        data: result.data,
      });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async getAnalyticsById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cacheKey = `analytics:${id}`;
      const cached = await getCache<any>(cacheKey);
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({
          message: Message.FETCHED,
          isCached: true,
          data: cached.data,
        });
      }

      const result: ServiceResult<Analytics> = await analyticsService.getAnalyticsById(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      if (result.status !== HTTP_STATUS.OK) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await setCache(cacheKey, result.data, 300);
      return res.status(result.status).json({
        message: Message.FETCHED,
        isCached: false,
        data: result.data,
      });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async updateAnalytics(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto = plainToInstance(CreateAnalyticsDTO, req.body);
      const errors = await validate(dto, { skipMissingProperties: true });
      if (errors.length > 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);

      const result: ServiceResult<Analytics> = await analyticsService.updateAnalytics(Number(id), dto);
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      if (result.status !== HTTP_STATUS.OK) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await delCache("analytics:all");
      await delCache(`analytics:${id}`);
      return res.status(result.status).json({
        message: Message.UPDATED,
        data: result.data,
      });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async deleteAnalytics(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result: ServiceResult<null> = await analyticsService.deleteAnalytics(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      if (result.status !== HTTP_STATUS.OK) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await delCache("analytics:all");
      await delCache(`analytics:${id}`);
      return res.status(result.status).json({ message: Message.DELETED });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }
}
