// src/service/flight_booking/flight_booking.service.ts
import { FlightBookingRepository } from "../../repository/flight_booking/flight_booking.repository";
import { CreateBookingDTO } from "../../dto/booking/booking.dto";
import { emailQueue } from "../../queues/email.queue";

export class FlightBookingService {
  constructor(private bookingRepo: FlightBookingRepository) {}

  async createBooking(dto: CreateBookingDTO) {
    const booking = await this.bookingRepo.createBooking(dto);

    // Add job to queue
    await emailQueue.add("sendEmail", {
      to: booking.email,
      subject: "Flight Booking Confirmation",
      templateData: {
        name: booking.bookedBy,
        flightNumber: booking.flightNumber,
        departure: booking.departure,
        destination: booking.destination,
        departureTime: booking.departureTime.toISOString(),
      },
    });

    return booking;
  }

  async getAllBookings() {
    return this.bookingRepo.getAllBookings();
  }

  async getBookingById(id: number) {
    return this.bookingRepo.getBookingById(id);
  }

  async updateBooking(id: number, dto: Partial<CreateBookingDTO>) {
    return this.bookingRepo.updateBooking(id, dto);
  }

  async deleteBooking(id: number) {
    return this.bookingRepo.deleteBooking(id);
  }
}