import { CreateAnalyticsDTO } from "../../dto/analytics/analytics.dto";
import { Analytics } from "../../entities/analytics.entity";
import { AnalyticsRepository } from "../../repository/analytics/analytics.repository";
import { HTTP_STATUS } from "../../constant/statusCode.interface";
import { ServiceResult } from "../../types/service_result";

export class AnalyticsService {
  private analyticsRepo: AnalyticsRepository;

  constructor(analyticsRepo: AnalyticsRepository) {
    this.analyticsRepo = analyticsRepo;
  }

  async createAnalytics(dto: CreateAnalyticsDTO): Promise<ServiceResult<Analytics>> {
    const created = await this.analyticsRepo.createAnalytics(dto);
    return { status: HTTP_STATUS.CREATED, data: created };
  }

  async getAllAnalytics(): Promise<ServiceResult<Analytics[]>> {
    const data = await this.analyticsRepo.getAllAnalytics();
    return { status: HTTP_STATUS.OK, data };
  }

  async getAnalyticsById(id: number): Promise<ServiceResult<Analytics>> {
    const data = await this.analyticsRepo.getAnalyticsById(id);
    if (!data) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data };
  }

  async updateAnalytics(
    id: number,
    dto: Partial<CreateAnalyticsDTO>
  ): Promise<ServiceResult<Analytics>> {
    const updated = await this.analyticsRepo.updateAnalytics(id, dto);
    if (!updated) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data: updated };
  }

  async deleteAnalytics(id: number): Promise<ServiceResult<null>> {
    const deleted = await this.analyticsRepo.deleteAnalytics(id);
    if (!deleted) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK };
  }
}
