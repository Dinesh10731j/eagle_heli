import { Repository } from "typeorm";
import { AppDataSource } from "../../configs/psqlDb.config";
import { NewsLetter } from "../../entities/news_letter.entity";
import { CreateNewsLetterDTO } from "../../dto/news_letter/news_letter.dto";

export class NewsLetterRepository {
  private repo: Repository<NewsLetter>;

  constructor() {
    this.repo = AppDataSource.getRepository(NewsLetter);
  }

  async createSubscription(dto: CreateNewsLetterDTO): Promise<NewsLetter> {
    const item = this.repo.create({ ...dto });
    return await this.repo.save(item);
  }

  async getAllSubscriptions(): Promise<NewsLetter[]> {
    return await this.repo.find({ order: { id: "DESC" } });
  }

  async getSubscriptionById(id: number): Promise<NewsLetter | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async deleteSubscription(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
