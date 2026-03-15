import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { FlightBookingService } from "../../service/booking/booking.service";
import { FlightBookingRepository } from "../../repository/flight_booking/flight_booking.repository";
import { CreateBookingDTO } from "../../dto/booking/booking.dto";
import { FlightBooking } from "../../entities/booking.entity";
import { AppDataSource } from "../../configs/psqlDb.config";

const bookingRepo = new FlightBookingRepository(AppDataSource.getRepository(FlightBooking));
const bookingService = new FlightBookingService(bookingRepo);

export class BookingController {
  // Create a booking
  static async createBooking(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateBookingDTO, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      const booking = await bookingService.createBooking(dto);

      return res.status(201).json({
        message: "Booking created successfully",
        data: booking,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Get all bookings
  static async getAllBookings(req: Request, res: Response) {
    try {
      const bookings = await bookingService.getAllBookings();

      return res.status(200).json({
        message: "Bookings fetched successfully",
        data: bookings,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Get booking by ID
  static async getBookingById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const booking = await bookingService.getBookingById(Number(id));

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      return res.status(200).json({
        message: "Booking fetched successfully",
        data: booking,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Update booking
  static async updateBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto = plainToInstance(CreateBookingDTO, req.body);
      const errors = await validate(dto, { skipMissingProperties: true });

      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      const updatedBooking = await bookingService.updateBooking(Number(id), dto);

      return res.status(200).json({
        message: "Booking updated successfully",
        data: updatedBooking,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Delete booking
  static async deleteBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await bookingService.deleteBooking(Number(id));

      if (!deleted) {
        return res.status(404).json({ message: "Booking not found" });
      }

      return res.status(200).json({
        message: "Booking deleted successfully",
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
}
