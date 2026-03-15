import { CreateNewsLetterDTO } from "../../dto/news_letter/news_letter.dto";
import { NewsLetter } from "../../entities/news_letter.entity";
import { NewsLetterRepository } from "../../repository/news_letter/news_letter.repository";
import { HTTP_STATUS } from "../../constant/statusCode.interface";
import { enqueueEmail } from "../../jobs/email.jobs";
import { buildNewsLetterBroadcastJob, buildNewsLetterSubscribeJob } from "../../functions/email.functions";

export class NewsLetterService {
  private newsRepo: NewsLetterRepository;

  constructor(newsRepo: NewsLetterRepository) {
    this.newsRepo = newsRepo;
  }

  async createSubscription(dto: CreateNewsLetterDTO) {
    const created = await this.newsRepo.createSubscription(dto);
    await enqueueEmail(buildNewsLetterSubscribeJob({ to: created.email }));
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

  async sendNewsletter(data: { subject: string; content: string; title?: string }) {
    const subscribers = await this.newsRepo.getAllSubscriptions();
    for (const sub of subscribers) {
      await enqueueEmail(
        buildNewsLetterBroadcastJob({
          to: sub.email,
          subject: data.subject,
          content: data.content,
          ...(data.title ? { title: data.title } : {}),
        })
      );
    }
    return { status: HTTP_STATUS.OK, data: { count: subscribers.length } };
  }
}
