import { Repository } from "typeorm";
import { AppDataSource } from "../../configs/psqlDb.config";
import { SeoMetaData } from "../../entities/seo_meta_data.entity";
import { CreateSeoMetaDataDTO } from "../../dto/seo_meta_data/seo_meta_data.dto";

export class SeoMetaDataRepository {
  private repo: Repository<SeoMetaData>;

  constructor() {
    this.repo = AppDataSource.getRepository(SeoMetaData);
  }

  async createSeoMetaData(dto: CreateSeoMetaDataDTO): Promise<SeoMetaData> {
    const item = this.repo.create({ ...dto });
    return await this.repo.save(item);
  }

  async getAllSeoMetaData(): Promise<SeoMetaData[]> {
    return await this.repo.find({ order: { id: "DESC" } });
  }

  async getSeoMetaDataById(id: number): Promise<SeoMetaData | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async updateSeoMetaData(id: number, dto: Partial<CreateSeoMetaDataDTO>): Promise<SeoMetaData | null> {
    const item = await this.getSeoMetaDataById(id);
    if (!item) return null;
    Object.assign(item, dto);
    return await this.repo.save(item);
  }

  async deleteSeoMetaData(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
