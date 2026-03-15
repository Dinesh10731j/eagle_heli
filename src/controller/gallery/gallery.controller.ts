import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateGalleryDTO } from "../../dto/gallery/gallery.dto";
import { GalleryRepository } from "../../repository/gallery/gallery.repository";
import { GalleryService } from "../../service/gallery/gallery.service";
import { cloudinary } from "../../configs/cloudinary.config";
import fs from "fs";

const galleryRepo = new GalleryRepository();
const galleryService = new GalleryService(galleryRepo);

export class GalleryController {
  // Create gallery item
  static async createGallery(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateGalleryDTO, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      const files = (req as any).files as
        | Record<string, Express.Multer.File[]>
        | undefined;
      const file = files?.image?.[0] || files?.file?.[0];
      if (!file?.path) {
        return res.status(400).json({ message: "Image file is required" });
      }

      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "gallery",
      });
      await fs.promises.unlink(file.path);

      dto.image = uploadResult.secure_url;

      const created = await galleryService.createGallery(dto);

      return res.status(201).json({
        message: "Gallery item created successfully",
        data: created,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Get all gallery items
  static async getAllGallery(req: Request, res: Response) {
    try {
      const items = await galleryService.getAllGallery();
      return res.status(200).json({
        message: "Gallery fetched successfully",
        data: items,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Get gallery item by ID
  static async getGalleryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const item = await galleryService.getGalleryById(Number(id));
      return res.status(200).json({
        message: "Gallery item fetched successfully",
        data: item,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Update gallery item
  static async updateGallery(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto = plainToInstance(CreateGalleryDTO, req.body);
      const errors = await validate(dto, { skipMissingProperties: true });

      if (errors.length > 0) {
        return res.status(400).json(errors);
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

      const updated = await galleryService.updateGallery(Number(id), dto);
      return res.status(200).json({
        message: "Gallery item updated successfully",
        data: updated,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Delete gallery item
  static async deleteGallery(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await galleryService.deleteGallery(Number(id));
      return res.status(200).json({
        message: "Gallery item deleted successfully",
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

}
