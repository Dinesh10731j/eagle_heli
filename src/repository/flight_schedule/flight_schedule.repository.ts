import { AppDataSource } from "../../configs/psqlDb.config";
import { FlightSchedule } from "../../entities/flightSchedule.entity";
import { Repository } from "typeorm";

export class FlightScheduleRepository {

  private repo: Repository<FlightSchedule>;

  constructor() {
    this.repo = AppDataSource.getRepository(FlightSchedule);
  }

  // Create flight schedule
  async createFlightSchedule(data: Partial<FlightSchedule>): Promise<FlightSchedule> {
    const schedule = this.repo.create(data);
    return await this.repo.save(schedule);
  }

  // Get all schedules
  async getAllSchedules(): Promise<FlightSchedule[]> {
    return await this.repo.find();
  }

  // Get schedule by ID
  async getScheduleById(id: number): Promise<FlightSchedule | null> {
    return await this.repo.findOne({
      where: { id }
    });
  }

  // Update schedule
  async updateSchedule(
    id: number,
    data: Partial<FlightSchedule>
  ): Promise<FlightSchedule | null> {

    await this.repo.update(id, data);

    return await this.repo.findOne({
      where: { id }
    });
  }

  // Delete schedule
  async deleteSchedule(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}