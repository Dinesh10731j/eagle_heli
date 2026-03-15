import { CreateTeamDTO } from "../../dto/team/team.dto";
import { Team } from "../../entities/team.entity";
import { TeamRepository } from "../../repository/team/team.repository";
import { HTTP_STATUS } from "../../constant/statusCode.interface";
import { ServiceResult } from "../../types/service_result";

export class TeamService {
  private teamRepo: TeamRepository;

  constructor(teamRepo: TeamRepository) {
    this.teamRepo = teamRepo;
  }

  async createTeam(dto: CreateTeamDTO): Promise<ServiceResult<Team>> {
    const created = await this.teamRepo.createTeam(dto);
    if (!created) return { status: HTTP_STATUS.INTERNAL_SERVER_ERROR };
    return { status: HTTP_STATUS.CREATED, data: created };
  }

  async getAllTeam(): Promise<ServiceResult<Team[]>> {
    const data = await this.teamRepo.getAllTeam();
    return { status: HTTP_STATUS.OK, data };
  }

  async getTeamById(id: number): Promise<ServiceResult<Team>> {
    const team = await this.teamRepo.getTeamById(id);
    if (!team) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data: team };
  }

  async updateTeam(id: number, dto: Partial<CreateTeamDTO>): Promise<ServiceResult<Team>> {
    const updated = await this.teamRepo.updateTeam(id, dto);
    if (!updated) return { status: HTTP_STATUS.NOT_FOUND };
    return { status: HTTP_STATUS.OK, data: updated };
  }

  async deleteTeam(id: number): Promise<ServiceResult<null>> {
    const team = await this.teamRepo.getTeamById(id);
    if (!team) return { status: HTTP_STATUS.NOT_FOUND };
    await this.teamRepo.deleteTeam(id);
    return { status: HTTP_STATUS.OK };
  }
}
