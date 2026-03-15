
import { FlightSchedule } from "../../entities/flightSchedule.entity";
import { CreateFlightScheduleDTO } from "../../dto/flight_schedule/flight_schedule.dto";
import { FlightScheduleRepository } from "../../repository/flight_schedule/flight_schedule.repository";
import { HTTP_STATUS } from "../../constant/statusCode.interface";

export class FlightScheduleService {

  private flightRepo: FlightScheduleRepository;

  constructor(flightRepo: FlightScheduleRepository) {
    this.flightRepo = flightRepo;
  }

  // Create schedule
  async createSchedule(dto: CreateFlightScheduleDTO) {
    const schedule = await this.flightRepo.createFlightSchedule(dto);
    return { status: HTTP_STATUS.CREATED, data: schedule };
  }

  // Get all schedules
  async getAllSchedules() {
    const data = await this.flightRepo.getAllSchedules();
    return { status: HTTP_STATUS.OK, data };
  }

  // Get schedule by ID
  async getScheduleById(id: number) {
    const data = await this.flightRepo.getScheduleById(id);
    if (!data) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data };
  }

  // Update schedule
  async updateSchedule(id: number, data: Partial<FlightSchedule>) {
    const updated = await this.flightRepo.updateSchedule(id, data);
    if (!updated) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data: updated };
  }

  // Delete schedule
  async deleteSchedule(id: number) {
    const deleted = await this.flightRepo.deleteSchedule(id);
    if (!deleted) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK };
  }
}
