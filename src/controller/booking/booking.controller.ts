import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { FlightBookingService } from "../../service/booking/booking.service";
import { FlightBookingRepository } from "../../repository/flight_booking/flight_booking.repository";
import { CreateBookingDTO } from "../../dto/booking/booking.dto";
import { FlightBooking } from "../../entities/booking.entity";
import { AppDataSource } from "../../configs/psqlDb.config";
import { getCache, setCache, delCache } from "../../utils/helpers/redis_helper";
import { HTTP_STATUS } from "../../constant/statusCode.interface";
import { Message } from "../../constant/message.interface";


const bookingRepo = new FlightBookingRepository(AppDataSource.getRepository(FlightBooking));
const bookingService = new FlightBookingService(bookingRepo);

export class BookingController {
  // Create a booking
  static async createBooking(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateBookingDTO, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);
      }

      const result = await bookingService.createBooking(dto);
      if (result.status !== HTTP_STATUS.CREATED || !result.data) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await delCache("bookings:all");
      await delCache(`booking:${result.data.id}`);

      return res.status(result.status).json({
        message: Message.FLIGHT_BOOKing_SUCCESS,
        data: result.data,
      });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  // Get all bookings
  static async getAllBookings(req: Request, res: Response) {
    try {
      const cached = await getCache<any[]>("bookings:all");
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({
          message: Message.FETCHED,
          isCached: true,
          data: cached.data,
        });
      }

      const result = await bookingService.getAllBookings();
      if (result.status !== HTTP_STATUS.OK || !result.data) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      const now = new Date();
      const withStatus = result.data.map((b) => ({
        ...b,
        isChed: b.departureTime ? new Date(b.departureTime) > now : false,
      }));

      await setCache("bookings:all", withStatus, 120);

      return res.status(HTTP_STATUS.OK).json({
        message: Message.FETCHED,
        isCached: false,
        data: withStatus,
      });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  // Get booking by ID
  static async getBookingById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cacheKey = `booking:${id}`;
      const cached = await getCache<any>(cacheKey);
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({
          message: Message.FETCHED,
          isCached: true,
          data: cached.data,
        });
      }
      const result = await bookingService.getBookingById(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND || !result.data) {
        return res.status(result.status).json({ message: Message.BOOKING_NOT_FOUND });
      }

      const payload = {
        ...result.data,
        isChed: result.data.departureTime ? new Date(result.data.departureTime) > new Date() : false,
      };
      await setCache(cacheKey, payload, 120);

      return res.status(result.status).json({
        message: Message.FETCHED,
        isCached: false,
        data: payload,
      });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  // Update booking
  static async updateBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto = plainToInstance(CreateBookingDTO, req.body);
      const errors = await validate(dto, { skipMissingProperties: true });

      if (errors.length > 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);
      }

      const result = await bookingService.updateBooking(Number(id), dto);
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.BOOKING_NOT_FOUND });
      }
      await delCache("bookings:all");
      await delCache(`booking:${id}`);

      return res.status(result.status).json({
        message: Message.UPDATED,
        data: result.data,
      });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  // Delete booking
  static async deleteBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await bookingService.deleteBooking(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.BOOKING_NOT_FOUND });
      }
      await delCache("bookings:all");
      await delCache(`booking:${id}`);

      return res.status(result.status).json({
        message: Message.DELETED,
      });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }
}
