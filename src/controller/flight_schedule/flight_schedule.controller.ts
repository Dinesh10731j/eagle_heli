import { Request, Response } from "express";
import { FlightScheduleService } from "../../service/flight_schedule/flight_schedule.service";
import { FlightScheduleRepository } from "../../repository/flight_schedule/flight_schedule.repository";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateFlightScheduleDTO } from "../../dto/flight_schedule/flight_schedule.dto";
import { getCache, setCache, delCache } from "../../utils/helpers/redis_helper";
import { HTTP_STATUS } from "../../constant/statusCode.interface";
import { Message } from "../../constant/message.interface";

const flightRepo = new FlightScheduleRepository();
const flightService = new FlightScheduleService(flightRepo);

export class FlightScheduleController {

  // Create flight schedule
  static async createSchedule(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateFlightScheduleDTO, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);

      const result = await flightService.createSchedule(dto);
      await delCache("flightSchedule:all");

      return res.status(result.status).json({ message: Message.CREATED, data: result.data });

    } catch (error: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  // Get all schedules
  static async getAllSchedules(req: Request, res: Response) {
    try {
      const cached = await getCache<any[]>("flightSchedule:all");
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({
          message: Message.FETCHED,
          isCached: true,
          data: cached.data,
        });
      }

      const result = await flightService.getAllSchedules();
      if (!result.data) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }

      await setCache("flightSchedule:all", result.data, 300);

      return res.status(HTTP_STATUS.OK).json({
        message: Message.FETCHED,
        isCached: false,
        data: result.data
      });

    } catch (error: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  // Get schedule by id
  static async getScheduleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cacheKey = `flightSchedule:${id}`;
      const cached = await getCache<any>(cacheKey);
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({
          message: Message.FETCHED,
          isCached: true,
          data: cached.data
        });
      }

      const result = await flightService.getScheduleById(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND || !result.data) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }

      return res.status(HTTP_STATUS.OK).json({
        message: Message.FETCHED,
        isCached: false,
        data: result.data
      });

    } catch (error: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  // Update schedule
  static async updateSchedule(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await flightService.updateSchedule(Number(id), req.body);
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await delCache("flightSchedule:all");
      await delCache(`flightSchedule:${id}`);

      return res.status(HTTP_STATUS.OK).json({
        message: Message.UPDATED,
        data: result.data
      });

    } catch (error: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  // Delete schedule
  static async deleteSchedule(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await flightService.deleteSchedule(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      await delCache("flightSchedule:all");
      await delCache(`flightSchedule:${id}`);

      return res.status(HTTP_STATUS.OK).json({ message: Message.DELETED });

    } catch (error: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }
}
