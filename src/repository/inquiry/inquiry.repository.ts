import { Repository } from "typeorm";
import { AppDataSource } from "../../configs/psqlDb.config";
import { Inquiry } from "../../entities/inquiry.entity";
import { CreateInquiryDTO } from "../../dto/inquiry/inquiry.dto";

export class InquiryRepository {
  private repo: Repository<Inquiry>;

  constructor() {
    this.repo = AppDataSource.getRepository(Inquiry);
  }

  async createInquiry(dto: CreateInquiryDTO): Promise<Inquiry> {
    const item = this.repo.create({ ...dto });
    return await this.repo.save(item);
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    return await this.repo.find({ order: { id: "DESC" } });
  }

  async getInquiryById(id: number): Promise<Inquiry | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async updateInquiry(id: number, dto: Partial<CreateInquiryDTO>): Promise<Inquiry | null> {
    const item = await this.getInquiryById(id);
    if (!item) return null;
    Object.assign(item, dto);
    return await this.repo.save(item);
  }

  async deleteInquiry(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
