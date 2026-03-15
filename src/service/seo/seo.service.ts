import { CreateSeoDTO } from "../../dto/seo/seo.dto";
import { Seo } from "../../entities/seo.entity";
import { SeoRepository } from "../../repository/seo/seo.repository";
import { HTTP_STATUS } from "../../constant/statusCode.interface";

export class SeoService {
  private seoRepo: SeoRepository;

  constructor(seoRepo: SeoRepository) {
    this.seoRepo = seoRepo;
  }

  async createSeo(dto: CreateSeoDTO) {
    const created = await this.seoRepo.createSeo(dto);
    return { status: HTTP_STATUS.CREATED, data: created };
  }

  async getAllSeo() {
    const data = await this.seoRepo.getAllSeo();
    return { status: HTTP_STATUS.OK, data };
  }

  async getSeoById(id: number) {
    const data = await this.seoRepo.getSeoById(id);
    if (!data) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data };
  }

  async updateSeo(id: number, dto: Partial<CreateSeoDTO>) {
    const updated = await this.seoRepo.updateSeo(id, dto);
    if (!updated) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data: updated };
  }

  async deleteSeo(id: number) {
    const deleted = await this.seoRepo.deleteSeo(id);
    if (!deleted) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK };
  }
}
