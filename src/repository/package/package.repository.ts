import { Repository } from "typeorm";
import { AppDataSource } from "../../configs/psqlDb.config";
import { Package } from "../../entities/package.entity";
import { CreatePackageDTO } from "../../dto/package/package.dto";

export class PackageRepository {
  private repo: Repository<Package>;

  constructor() {
    this.repo = AppDataSource.getRepository(Package);
  }

  async createPackage(dto: CreatePackageDTO): Promise<Package> {
    const item = this.repo.create({ ...dto });
    return await this.repo.save(item);
  }

  async getAllPackages(): Promise<Package[]> {
    return await this.repo.find({ order: { id: "DESC" } });
  }

  async getPackageById(id: number): Promise<Package | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async updatePackage(id: number, dto: Partial<CreatePackageDTO>): Promise<Package | null> {
    const item = await this.getPackageById(id);
    if (!item) return null;
    Object.assign(item, dto);
    return await this.repo.save(item);
  }

  async deletePackage(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
