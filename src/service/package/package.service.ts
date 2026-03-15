import { CreatePackageDTO } from "../../dto/package/package.dto";
import { Package } from "../../entities/package.entity";
import { PackageRepository } from "../../repository/package/package.repository";
import { HTTP_STATUS } from "../../constant/statusCode.interface";

export class PackageService {
  private packageRepo: PackageRepository;

  constructor(packageRepo: PackageRepository) {
    this.packageRepo = packageRepo;
  }

  async createPackage(dto: CreatePackageDTO) {
    const created = await this.packageRepo.createPackage(dto);
    return { status: HTTP_STATUS.CREATED, data: created };
  }

  async getAllPackages() {
    const data = await this.packageRepo.getAllPackages();
    return { status: HTTP_STATUS.OK, data };
  }

  async getPackageById(id: number) {
    const data = await this.packageRepo.getPackageById(id);
    if (!data) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data };
  }

  async updatePackage(id: number, dto: Partial<CreatePackageDTO>) {
    const updated = await this.packageRepo.updatePackage(id, dto);
    if (!updated) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data: updated };
  }

  async deletePackage(id: number) {
    const deleted = await this.packageRepo.deletePackage(id);
    if (!deleted) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK };
  }
}
