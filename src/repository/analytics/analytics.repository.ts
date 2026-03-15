import { Repository } from "typeorm";
import { AppDataSource } from "../../configs/psqlDb.config";
import { Analytics } from "../../entities/analytics.entity";
import { CreateAnalyticsDTO } from "../../dto/analytics/analytics.dto";

export class AnalyticsRepository {
  private repo: Repository<Analytics>;

  constructor() {
    this.repo = AppDataSource.getRepository(Analytics);
  }

  async createAnalytics(dto: CreateAnalyticsDTO): Promise<Analytics> {
    const item = this.repo.create({ ...dto });
    return await this.repo.save(item);
  }

  async getAllAnalytics(): Promise<Analytics[]> {
    return await this.repo.find({ order: { id: "DESC" } });
  }

  async getAnalyticsById(id: number): Promise<Analytics | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async updateAnalytics(id: number, dto: Partial<CreateAnalyticsDTO>): Promise<Analytics | null> {
    const item = await this.getAnalyticsById(id);
    if (!item) return null;
    Object.assign(item, dto);
    return await this.repo.save(item);
  }

  async deleteAnalytics(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
