import { Repository } from "typeorm";
import { AppDataSource } from "../../configs/psqlDb.config";
import { Gallery } from "../../entities/gallery.entity";
import { CreateGalleryDTO } from "../../dto/gallery/gallery.dto";

export class GalleryRepository {
  private repo: Repository<Gallery>;

  constructor() {
    this.repo = AppDataSource.getRepository(Gallery);
  }

  async createGallery(dto: CreateGalleryDTO): Promise<Gallery> {
    const gallery = this.repo.create({ ...dto });
    if (dto.date) {
      gallery.date = new Date(dto.date);
    }
    return await this.repo.save(gallery);
  }

  async getAllGallery(): Promise<Gallery[]> {
    return await this.repo.find({ order: { id: "DESC" } });
  }

  async getGalleryById(id: number): Promise<Gallery | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async updateGallery(id: number, dto: Partial<CreateGalleryDTO>): Promise<Gallery | null> {
    const gallery = await this.getGalleryById(id);
    if (!gallery) return null;

    Object.assign(gallery, dto);
    if (dto.date) gallery.date = new Date(dto.date);

    return await this.repo.save(gallery);
  }

  async deleteGallery(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
