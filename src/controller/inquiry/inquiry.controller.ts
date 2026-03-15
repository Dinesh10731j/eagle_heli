import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateInquiryDTO } from "../../dto/inquiry/inquiry.dto";
import { InquiryRepository } from "../../repository/inquiry/inquiry.repository";
import { InquiryService } from "../../service/inquiry/inquiry.service";
import { getCache, setCache, delCache } from "../../utils/helpers/redis_helper";
import { HTTP_STATUS } from "../../constant/statusCode.interface";
import { Message } from "../../constant/message.interface";

const inquiryRepo = new InquiryRepository();
const inquiryService = new InquiryService(inquiryRepo);

export class InquiryController {
  static async createInquiry(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateInquiryDTO, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);

      const result = await inquiryService.createInquiry(dto);
      if (!result.data) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await delCache("inquiry:all");
      return res.status(result.status).json({ message: Message.CREATED, data: result.data });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async getAllInquiries(req: Request, res: Response) {
    try {
      const cached = await getCache<any[]>("inquiry:all");
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: true, data: cached.data });
      }
      const result = await inquiryService.getAllInquiries();
      if (!result.data) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await setCache("inquiry:all", result.data, 300);
      return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: false, data: result.data });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async getInquiryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cacheKey = `inquiry:${id}`;
      const cached = await getCache<any>(cacheKey);
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: true, data: cached.data });
      }
      const result = await inquiryService.getInquiryById(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND || !result.data) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await setCache(cacheKey, result.data, 300);
      return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: false, data: result.data });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async updateInquiry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto = plainToInstance(CreateInquiryDTO, req.body);
      const errors = await validate(dto, { skipMissingProperties: true });
      if (errors.length > 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);

      const result = await inquiryService.updateInquiry(Number(id), dto);
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await delCache("inquiry:all");
      await delCache(`inquiry:${id}`);
      return res.status(HTTP_STATUS.OK).json({ message: Message.UPDATED, data: result.data });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async deleteInquiry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await inquiryService.deleteInquiry(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await delCache("inquiry:all");
      await delCache(`inquiry:${id}`);
      return res.status(HTTP_STATUS.OK).json({ message: Message.DELETED });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }
}
