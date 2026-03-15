// src/service/flight_booking/flight_booking.service.ts
import { FlightBookingRepository } from "../../repository/flight_booking/flight_booking.repository";
import { CreateBookingDTO } from "../../dto/booking/booking.dto";
import { enqueueEmail } from "../../jobs/email.jobs";
import { buildBookingEmailJob } from "../../functions/email.functions";
import { HTTP_STATUS } from "../../constant/statusCode.interface";
import { emitBookingEvent } from "../../configs/socket.config";

export class FlightBookingService {
  constructor(private bookingRepo: FlightBookingRepository) {}

  async createBooking(dto: CreateBookingDTO) {
    const booking = await this.bookingRepo.createBooking(dto);

    // Add job to queue
    await enqueueEmail(buildBookingEmailJob(booking));
    emitBookingEvent("created", booking);

    return { status: HTTP_STATUS.CREATED, data: booking };
  }

  async getAllBookings() {
    const data = await this.bookingRepo.getAllBookings();
    return { status: HTTP_STATUS.OK, data };
  }

  async getBookingById(id: number) {
    const data = await this.bookingRepo.getBookingById(id);
    if (!data) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data };
  }

  async updateBooking(id: number, dto: Partial<CreateBookingDTO>) {
    const existing = await this.bookingRepo.getBookingById(id);
    if (!existing) return { status: HTTP_STATUS.NOT_FOUND };
    const updated = await this.bookingRepo.updateBooking(id, dto);

    if (updated && dto.status && existing.status !== dto.status) {
      await enqueueEmail(buildBookingEmailJob(updated));
    }
    if (updated) {
      emitBookingEvent("updated", updated);
    }

    return { status: HTTP_STATUS.OK, data: updated };
  }

  async deleteBooking(id: number) {
    const deleted = await this.bookingRepo.deleteBooking(id);
    if (!deleted) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK };
  }
}
