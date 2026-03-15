import { CreateContactDTO } from "../../dto/contact/contact.dto";
import { Contact } from "../../entities/contact.entity";
import { ContactRepository } from "../../repository/contact/contact.repository";
import { HTTP_STATUS } from "../../constant/statusCode.interface";

export class ContactService {
  private contactRepo: ContactRepository;

  constructor(contactRepo: ContactRepository) {
    this.contactRepo = contactRepo;
  }

  async createContact(dto: CreateContactDTO) {
    const created = await this.contactRepo.createContact(dto);
    return { status: HTTP_STATUS.CREATED, data: created };
  }

  async getAllContacts() {
    const data = await this.contactRepo.getAllContacts();
    return { status: HTTP_STATUS.OK, data };
  }

  async getContactById(id: number) {
    const data = await this.contactRepo.getContactById(id);
    if (!data) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data };
  }

  async updateContact(id: number, dto: Partial<CreateContactDTO>) {
    const updated = await this.contactRepo.updateContact(id, dto);
    if (!updated) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data: updated };
  }

  async deleteContact(id: number) {
    const deleted = await this.contactRepo.deleteContact(id);
    if (!deleted) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK };
  }
}
