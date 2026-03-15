import { Repository } from "typeorm";
import { AppDataSource } from "../../configs/psqlDb.config";
import { Reply } from "../../entities/reply.entity";
import { CreateReplyDTO } from "../../dto/reply/reply.dto";

export class ReplyRepository {
  private repo: Repository<Reply>;

  constructor() {
    this.repo = AppDataSource.getRepository(Reply);
  }

  async createReply(dto: CreateReplyDTO): Promise<Reply> {
    const item = this.repo.create({ ...dto });
    return await this.repo.save(item);
  }

  async getAllReplies(): Promise<Reply[]> {
    return await this.repo.find({ order: { id: "DESC" } });
  }

  async getReplyById(id: number): Promise<Reply | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async updateReply(id: number, dto: Partial<CreateReplyDTO>): Promise<Reply | null> {
    const item = await this.getReplyById(id);
    if (!item) return null;
    Object.assign(item, dto);
    return await this.repo.save(item);
  }

  async deleteReply(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
