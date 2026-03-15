import { CreateNewsLetterDTO } from "../../dto/news_letter/news_letter.dto";
import { NewsLetter } from "../../entities/news_letter.entity";
import { NewsLetterRepository } from "../../repository/news_letter/news_letter.repository";
import { HTTP_STATUS } from "../../constant/statusCode.interface";

export class NewsLetterService {
  private newsRepo: NewsLetterRepository;

  constructor(newsRepo: NewsLetterRepository) {
    this.newsRepo = newsRepo;
  }

  async createSubscription(dto: CreateNewsLetterDTO) {
    const created = await this.newsRepo.createSubscription(dto);
    return { status: HTTP_STATUS.CREATED, data: created };
  }

  async getAllSubscriptions() {
    const data = await this.newsRepo.getAllSubscriptions();
    return { status: HTTP_STATUS.OK, data };
  }

  async getSubscriptionById(id: number) {
    const data = await this.newsRepo.getSubscriptionById(id);
    if (!data) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data };
  }

  async deleteSubscription(id: number) {
    const deleted = await this.newsRepo.deleteSubscription(id);
    if (!deleted) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK };
  }
}
