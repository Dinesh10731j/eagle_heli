import { CreateSeoMetaDataDTO } from "../../dto/seo_meta_data/seo_meta_data.dto";
import { SeoMetaData } from "../../entities/seo_meta_data.entity";
import { SeoMetaDataRepository } from "../../repository/seo_meta_data/seo_meta_data.repository";
import { HTTP_STATUS } from "../../constant/statusCode.interface";

export class SeoMetaDataService {
  private seoMetaRepo: SeoMetaDataRepository;

  constructor(seoMetaRepo: SeoMetaDataRepository) {
    this.seoMetaRepo = seoMetaRepo;
  }

  async createSeoMetaData(dto: CreateSeoMetaDataDTO) {
    const created = await this.seoMetaRepo.createSeoMetaData(dto);
    return { status: HTTP_STATUS.CREATED, data: created };
  }

  async getAllSeoMetaData() {
    const data = await this.seoMetaRepo.getAllSeoMetaData();
    return { status: HTTP_STATUS.OK, data };
  }

  async getSeoMetaDataById(id: number) {
    const data = await this.seoMetaRepo.getSeoMetaDataById(id);
    if (!data) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data };
  }

  async updateSeoMetaData(id: number, dto: Partial<CreateSeoMetaDataDTO>) {
    const updated = await this.seoMetaRepo.updateSeoMetaData(id, dto);
    if (!updated) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data: updated };
  }

  async deleteSeoMetaData(id: number) {
    const deleted = await this.seoMetaRepo.deleteSeoMetaData(id);
    if (!deleted) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK };
  }
}
