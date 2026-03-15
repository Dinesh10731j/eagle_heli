import { Repository } from "typeorm";
import { FlightBooking } from "../../entities/booking.entity";
import { CreateBookingDTO } from "../../dto/booking/booking.dto";

export class FlightBookingRepository {
  constructor(private repo: Repository<FlightBooking>) {}

  async createBooking(dto: CreateBookingDTO) {
    const booking = this.repo.create({
      ...dto,
      bookedAt: dto.bookedAt ? new Date(dto.bookedAt) : new Date(),
      departureTime: new Date(dto.departureTime),
      arrivalTime: new Date(dto.arrivalTime),
    });
    return this.repo.save(booking);
  }

  async getAllBookings() {
    return this.repo.find();
  }

  async getBookingById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async updateBooking(id: number, dto: Partial<CreateBookingDTO>) {
    const booking = await this.getBookingById(id);
    if (!booking) return null;

    Object.assign(booking, dto);
    if (dto.departureTime) booking.departureTime = new Date(dto.departureTime);
    if (dto.arrivalTime) booking.arrivalTime = new Date(dto.arrivalTime);
    if (dto.bookedAt) booking.bookedAt = new Date(dto.bookedAt);

    return this.repo.save(booking);
  }

  async deleteBooking(id: number) {
    const result = await this.repo.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
