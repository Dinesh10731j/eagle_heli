import { Repository } from "typeorm";
import { AppDataSource } from "../../configs/psqlDb.config";
import { Seo } from "../../entities/seo.entity";
import { CreateSeoDTO } from "../../dto/seo/seo.dto";

export class SeoRepository {
  private repo: Repository<Seo>;

  constructor() {
    this.repo = AppDataSource.getRepository(Seo);
  }

  async createSeo(dto: CreateSeoDTO): Promise<Seo> {
    const item = this.repo.create({ ...dto });
    return await this.repo.save(item);
  }

  async getAllSeo(): Promise<Seo[]> {
    return await this.repo.find({ order: { id: "DESC" } });
  }

  async getSeoById(id: number): Promise<Seo | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async updateSeo(id: number, dto: Partial<CreateSeoDTO>): Promise<Seo | null> {
    const item = await this.getSeoById(id);
    if (!item) return null;
    Object.assign(item, dto);
    return await this.repo.save(item);
  }

  async deleteSeo(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
