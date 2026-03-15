
import { FlightSchedule } from "../../entities/flightSchedule.entity";
import { CreateFlightScheduleDTO } from "../../dto/flight_schedule/flight_schedule.dto";
import { FlightScheduleRepository } from "../../repository/flight_schedule/flight_schedule.repository";

export class FlightScheduleService {

  private flightRepo: FlightScheduleRepository;

  constructor(flightRepo: FlightScheduleRepository) {
    this.flightRepo = flightRepo;
  }

  // Create schedule
  async createSchedule(dto: CreateFlightScheduleDTO): Promise<FlightSchedule> {

    const schedule = await this.flightRepo.createFlightSchedule(dto);

    if (!schedule) {
      throw new Error("Failed to create flight schedule");
    }

    return schedule;
  }

  // Get all schedules
  async getAllSchedules(): Promise<FlightSchedule[]> {
    return await this.flightRepo.getAllSchedules();
  }

  // Get schedule by ID
  async getScheduleById(id: number): Promise<FlightSchedule | null> {

    const schedule = await this.flightRepo.getScheduleById(id);

    if (!schedule) {
      throw new Error("Flight schedule not found");
    }

    return schedule;
  }

  // Update schedule
  async updateSchedule(
    id: number,
    data: Partial<FlightSchedule>
  ): Promise<FlightSchedule> {

    const updated = await this.flightRepo.updateSchedule(id, data);

    if (!updated) {
      throw new Error("Failed to update schedule");
    }

    return updated;
  }

  // Delete schedule
  async deleteSchedule(id: number): Promise<void> {

    const schedule = await this.flightRepo.getScheduleById(id);

    if (!schedule) {
      throw new Error("Flight schedule not found");
    }

    await this.flightRepo.deleteSchedule(id);
  }
}