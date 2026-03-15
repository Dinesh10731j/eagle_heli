import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateGalleryDTO } from "../../dto/gallery/gallery.dto";
import { GalleryRepository } from "../../repository/gallery/gallery.repository";
import { GalleryService } from "../../service/gallery/gallery.service";
import { cloudinary } from "../../configs/cloudinary.config";
import fs from "fs";
import { getCache, setCache, delCache } from "../../utils/helpers/redis_helper";
import { HTTP_STATUS } from "../../constant/statusCode.interface";
import { Message } from "../../constant/message.interface";

const galleryRepo = new GalleryRepository();
const galleryService = new GalleryService(galleryRepo);

export class GalleryController {
  // Create gallery item
  static async createGallery(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateGalleryDTO, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);
      }

      const files = (req as any).files as
        | Record<string, Express.Multer.File[]>
        | undefined;
      const file = files?.image?.[0] || files?.file?.[0];
      if (!file?.path) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: Message.INVALID_REQUEST });
      }

      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "gallery",
      });
      await fs.promises.unlink(file.path);

      dto.image = uploadResult.secure_url;

      const result = await galleryService.createGallery(dto);
      if (result.status !== HTTP_STATUS.CREATED || !result.data) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await delCache("gallery:all");

      return res.status(result.status).json({
        message: Message.CREATED,
        data: result.data,
      });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  // Get all gallery items
  static async getAllGallery(req: Request, res: Response) {
    try {
      const cached = await getCache<any[]>("gallery:all");
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({
          message: Message.FETCHED,
          isCached: true,
          data: cached.data,
        });
      }

      const result = await galleryService.getAllGallery();
      if (result.status !== HTTP_STATUS.OK || !result.data) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await setCache("gallery:all", result.data, 300);
      return res.status(HTTP_STATUS.OK).json({
        message: Message.FETCHED,
        isCached: false,
        data: result.data,
      });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  // Get gallery item by ID
  static async getGalleryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cacheKey = `gallery:${id}`;
      const cached = await getCache<any>(cacheKey);
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({
          message: Message.FETCHED,
          isCached: true,
          data: cached.data,
        });
      }
      const result = await galleryService.getGalleryById(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND || !result.data) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await setCache(cacheKey, result.data, 300);
      return res.status(HTTP_STATUS.OK).json({
        message: Message.FETCHED,
        isCached: false,
        data: result.data,
      });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  // Update gallery item
  static async updateGallery(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto = plainToInstance(CreateGalleryDTO, req.body);
      const errors = await validate(dto, { skipMissingProperties: true });

      if (errors.length > 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);
      }

      const files = (req as any).files as
        | Record<string, Express.Multer.File[]>
        | undefined;
      const file = files?.image?.[0] || files?.file?.[0];
      if (file?.path) {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: "gallery",
        });
        await fs.promises.unlink(file.path);
        dto.image = uploadResult.secure_url;
      }

      const result = await galleryService.updateGallery(Number(id), dto);
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await delCache("gallery:all");
      await delCache(`gallery:${id}`);
      return res.status(HTTP_STATUS.OK).json({
        message: Message.UPDATED,
        data: result.data,
      });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  // Delete gallery item
  static async deleteGallery(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await galleryService.deleteGallery(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await delCache("gallery:all");
      await delCache(`gallery:${id}`);
      return res.status(result.status).json({
        message: Message.DELETED,
      });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

}
