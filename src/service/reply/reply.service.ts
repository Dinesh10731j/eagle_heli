import { CreateReplyDTO } from "../../dto/reply/reply.dto";
import { Reply } from "../../entities/reply.entity";
import { ReplyRepository } from "../../repository/reply/reply.repository";
import { HTTP_STATUS } from "../../constant/statusCode.interface";
import { enqueueEmail } from "../../jobs/email.jobs";
import { buildReplyEmailJob } from "../../functions/email.functions";

export class ReplyService {
  private replyRepo: ReplyRepository;

  constructor(replyRepo: ReplyRepository) {
    this.replyRepo = replyRepo;
  }

  async createReply(dto: CreateReplyDTO) {
    const created = await this.replyRepo.createReply(dto);
    const replyJob = {
      to: created.email,
      name: created.name,
      message: created.message,
      ...(created.relatedTo ? { relatedTo: created.relatedTo } : {}),
    };
    await enqueueEmail(buildReplyEmailJob(replyJob));
    return { status: HTTP_STATUS.CREATED, data: created };
  }

  async getAllReplies() {
    const data = await this.replyRepo.getAllReplies();
    return { status: HTTP_STATUS.OK, data };
  }

  async getReplyById(id: number) {
    const data = await this.replyRepo.getReplyById(id);
    if (!data) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data };
  }

  async updateReply(id: number, dto: Partial<CreateReplyDTO>) {
    const updated = await this.replyRepo.updateReply(id, dto);
    if (!updated) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data: updated };
  }

  async deleteReply(id: number) {
    const deleted = await this.replyRepo.deleteReply(id);
    if (!deleted) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK };
  }
}
