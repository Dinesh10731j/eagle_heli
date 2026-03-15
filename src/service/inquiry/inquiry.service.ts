import { CreateInquiryDTO } from "../../dto/inquiry/inquiry.dto";
import { Inquiry } from "../../entities/inquiry.entity";
import { InquiryRepository } from "../../repository/inquiry/inquiry.repository";
import { HTTP_STATUS } from "../../constant/statusCode.interface";

export class InquiryService {
  private inquiryRepo: InquiryRepository;

  constructor(inquiryRepo: InquiryRepository) {
    this.inquiryRepo = inquiryRepo;
  }

  async createInquiry(dto: CreateInquiryDTO) {
    const created = await this.inquiryRepo.createInquiry(dto);
    return { status: HTTP_STATUS.CREATED, data: created };
  }

  async getAllInquiries() {
    const data = await this.inquiryRepo.getAllInquiries();
    return { status: HTTP_STATUS.OK, data };
  }

  async getInquiryById(id: number) {
    const data = await this.inquiryRepo.getInquiryById(id);
    if (!data) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data };
  }

  async updateInquiry(id: number, dto: Partial<CreateInquiryDTO>) {
    const updated = await this.inquiryRepo.updateInquiry(id, dto);
    if (!updated) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data: updated };
  }

  async deleteInquiry(id: number) {
    const deleted = await this.inquiryRepo.deleteInquiry(id);
    if (!deleted) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK };
  }
}
