import { Request, Response } from "express";
import { FlightScheduleService } from "../../service/flight_schedule/flight_schedule.service";
import { FlightScheduleRepository } from "../../repository/flight_schedule/flight_schedule.repository";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateFlightScheduleDTO } from "../../dto/flight_schedule/flight_schedule.dto";

const flightRepo = new FlightScheduleRepository();
const flightService = new FlightScheduleService(flightRepo);

export class FlightScheduleController {

  // Create flight schedule
  static async createSchedule(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateFlightScheduleDTO, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      const schedule = await flightService.createSchedule(dto);

      return res.status(201).json({
        message: "Flight schedule created successfully",
      });

    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get all schedules
  static async getAllSchedules(req: Request, res: Response) {
    try {
      const schedules = await flightService.getAllSchedules();

      return res.status(200).json({
        message: "Flight schedules fetched",
        data: schedules
      });

    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get schedule by id
  static async getScheduleById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const schedule = await flightService.getScheduleById(Number(id));

      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }

      return res.status(200).json({
        message: "Schedule fetched",
        data: schedule
      });

    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Update schedule
  static async updateSchedule(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const updated = await flightService.updateSchedule(Number(id), req.body);

      return res.status(200).json({
        message: "Schedule updated",
        data: updated
      });

    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Delete schedule
  static async deleteSchedule(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await flightService.deleteSchedule(Number(id));

      return res.status(200).json({
        message: "Schedule deleted successfully"
      });

    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}