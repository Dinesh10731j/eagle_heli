import { CreateGalleryDTO } from "../../dto/gallery/gallery.dto";
import { Gallery } from "../../entities/gallery.entity";
import { GalleryRepository } from "../../repository/gallery/gallery.repository";
import { HTTP_STATUS } from "../../constant/statusCode.interface";

export class GalleryService {
  private galleryRepo: GalleryRepository;

  constructor(galleryRepo: GalleryRepository) {
    this.galleryRepo = galleryRepo;
  }

  async createGallery(dto: CreateGalleryDTO) {
    const created = await this.galleryRepo.createGallery(dto);
    return { status: HTTP_STATUS.CREATED, data: created };
  }

  async getAllGallery() {
    const data = await this.galleryRepo.getAllGallery();
    return { status: HTTP_STATUS.OK, data };
  }

  async getGalleryById(id: number) {
    const data = await this.galleryRepo.getGalleryById(id);
    if (!data) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data };
  }

  async updateGallery(id: number, dto: Partial<CreateGalleryDTO>) {
    const updated = await this.galleryRepo.updateGallery(id, dto);
    if (!updated) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data: updated };
  }

  async deleteGallery(id: number) {
    const deleted = await this.galleryRepo.deleteGallery(id);
    if (!deleted) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK };
  }
}
