import { Repository } from "typeorm";
import { AppDataSource } from "../../configs/psqlDb.config";
import { Contact } from "../../entities/contact.entity";
import { CreateContactDTO } from "../../dto/contact/contact.dto";

export class ContactRepository {
  private repo: Repository<Contact>;

  constructor() {
    this.repo = AppDataSource.getRepository(Contact);
  }

  async createContact(dto: CreateContactDTO): Promise<Contact> {
    const item = this.repo.create({ ...dto });
    return await this.repo.save(item);
  }

  async getAllContacts(): Promise<Contact[]> {
    return await this.repo.find({ order: { id: "DESC" } });
  }

  async getContactById(id: number): Promise<Contact | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async updateContact(id: number, dto: Partial<CreateContactDTO>): Promise<Contact | null> {
    const item = await this.getContactById(id);
    if (!item) return null;
    Object.assign(item, dto);
    return await this.repo.save(item);
  }

  async deleteContact(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
