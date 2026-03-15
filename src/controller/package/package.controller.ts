import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreatePackageDTO } from "../../dto/package/package.dto";
import { PackageRepository } from "../../repository/package/package.repository";
import { PackageService } from "../../service/package/package.service";
import { getCache, setCache, delCache } from "../../utils/helpers/redis_helper";
import { HTTP_STATUS } from "../../constant/statusCode.interface";
import { Message } from "../../constant/message.interface";
import { cloudinary } from "../../configs/cloudinary.config";
import fs from "fs";

const packageRepo = new PackageRepository();
const packageService = new PackageService(packageRepo);

export class PackageController {
  static async createPackage(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreatePackageDTO, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);

      const files = (req as any).files as
        | Record<string, Express.Multer.File[]>
        | undefined;
      const file = files?.image?.[0] || files?.file?.[0];
      if (file?.path) {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: "packages",
        });
        await fs.promises.unlink(file.path);
        dto.image = uploadResult.secure_url;
      }

      const result = await packageService.createPackage(dto);
      if (!result.data) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await delCache("package:all");
      return res.status(result.status).json({ message: Message.CREATED, data: result.data });
    } catch (err: any) {
      console.error("Package create error:", err);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: Message.INTERNAL_SERVER_ERROR,
        ...(process.env.NODE_ENV !== "production" && { error: err?.message ?? String(err) }),
      });
    }
  }

  static async getAllPackages(req: Request, res: Response) {
    try {
      const cached = await getCache<any[]>("package:all");
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: true, data: cached.data });
      }
      const result = await packageService.getAllPackages();
      if (!result.data) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await setCache("package:all", result.data, 300);
      return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: false, data: result.data });
    } catch (err: any) {
      console.error("Package update error:", err);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: Message.INTERNAL_SERVER_ERROR,
        ...(process.env.NODE_ENV !== "production" && { error: err?.message ?? String(err) }),
      });
    }
  }

  static async getPackageById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cacheKey = `package:${id}`;
      const cached = await getCache<any>(cacheKey);
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: true, data: cached.data });
      }
      const result = await packageService.getPackageById(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND || !result.data) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await setCache(cacheKey, result.data, 300);
      return res.status(HTTP_STATUS.OK).json({ message: Message.FETCHED, isCached: false, data: result.data });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async updatePackage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto = plainToInstance(CreatePackageDTO, req.body);
      const errors = await validate(dto, { skipMissingProperties: true });
      if (errors.length > 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);

      const files = (req as any).files as
        | Record<string, Express.Multer.File[]>
        | undefined;
      const file = files?.image?.[0] || files?.file?.[0];
      if (file?.path) {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: "packages",
        });
        await fs.promises.unlink(file.path);
        dto.image = uploadResult.secure_url;
      }

      const result = await packageService.updatePackage(Number(id), dto);
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await delCache("package:all");
      await delCache(`package:${id}`);
      return res.status(HTTP_STATUS.OK).json({ message: Message.UPDATED, data: result.data });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  static async deletePackage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await packageService.deletePackage(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await delCache("package:all");
      await delCache(`package:${id}`);
      return res.status(HTTP_STATUS.OK).json({ message: Message.DELETED });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }
}
