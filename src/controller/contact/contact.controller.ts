import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateContactDTO } from "../../dto/contact/contact.dto";
import { ContactRepository } from "../../repository/contact/contact.repository";
import { ContactService } from "../../service/contact/contact.service";
import { getCache, setCache, delCache } from "../../utils/helpers/redis_helper";
import { HTTP_STATUS } from "../../constant/statusCode.interface";
import { Message } from "../../constant/message.interface";

const contactRepo = new ContactRepository();
const contactService = new ContactService(contactRepo);

export class ContactController {
  static async createContact(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateContactDTO, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);

      const result = await contactService.createContact(dto);
      if (!result.data) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await delCache("contact:all");
      return res.status(result.status).json({ message: Message.CREATED });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async getAllContacts(req: Request, res: Response) {
    try {
      const cached = await getCache<any[]>("contact:all");
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: true, data: cached.data });
      }
      const result = await contactService.getAllContacts();
      if (!result.data) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await setCache("contact:all", result.data, 300);
      return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: false, data: result.data });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async getContactById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cacheKey = `contact:${id}`;
      const cached = await getCache<any>(cacheKey);
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: true, data: cached.data });
      }
      const result = await contactService.getContactById(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND || !result.data) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await setCache(cacheKey, result.data, 300);
      return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: false, data: result.data });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async updateContact(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto = plainToInstance(CreateContactDTO, req.body);
      const errors = await validate(dto, { skipMissingProperties: true });
      if (errors.length > 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);

      const result = await contactService.updateContact(Number(id), dto);
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await delCache("contact:all");
      await delCache(`contact:${id}`);
      return res.status(HTTP_STATUS.OK).json({ message: Message.UPDATED, data: result.data });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async deleteContact(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await contactService.deleteContact(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await delCache("contact:all");
      await delCache(`contact:${id}`);
      return res.status(HTTP_STATUS.OK).json({ message: Message.DELETED });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }
}
