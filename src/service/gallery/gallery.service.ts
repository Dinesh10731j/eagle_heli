import { CreateGalleryDTO } from "../../dto/gallery/gallery.dto";
import { Gallery } from "../../entities/gallery.entity";
import { GalleryRepository } from "../../repository/gallery/gallery.repository";

export class GalleryService {
  private galleryRepo: GalleryRepository;

  constructor(galleryRepo: GalleryRepository) {
    this.galleryRepo = galleryRepo;
  }

  async createGallery(dto: CreateGalleryDTO): Promise<Gallery> {
    const created = await this.galleryRepo.createGallery(dto);
    if (!created) {
      throw new Error("Failed to create gallery item");
    }
    return created;
  }

  async getAllGallery(): Promise<Gallery[]> {
    return await this.galleryRepo.getAllGallery();
  }

  async getGalleryById(id: number): Promise<Gallery | null> {
    const gallery = await this.galleryRepo.getGalleryById(id);
    if (!gallery) {
      throw new Error("Gallery item not found");
    }
    return gallery;
  }

  async updateGallery(id: number, dto: Partial<CreateGalleryDTO>): Promise<Gallery> {
    const updated = await this.galleryRepo.updateGallery(id, dto);
    if (!updated) {
      throw new Error("Failed to update gallery item");
    }
    return updated;
  }

  async deleteGallery(id: number): Promise<void> {
    const existing = await this.galleryRepo.getGalleryById(id);
    if (!existing) {
      throw new Error("Gallery item not found");
    }
    await this.galleryRepo.deleteGallery(id);
  }
}
