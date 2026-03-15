import { Repository } from "typeorm";
import { AppDataSource } from "../../configs/psqlDb.config";
import { Team } from "../../entities/team.entity";
import { CreateTeamDTO } from "../../dto/team/team.dto";

export class TeamRepository {
  private repo: Repository<Team>;

  constructor() {
    this.repo = AppDataSource.getRepository(Team);
  }

  async createTeam(dto: CreateTeamDTO): Promise<Team> {
    const team = this.repo.create({ ...dto });
    return await this.repo.save(team);
  }

  async getAllTeam(): Promise<Team[]> {
    return await this.repo.find({ order: { id: "DESC" } });
  }

  async getTeamById(id: number): Promise<Team | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async updateTeam(id: number, dto: Partial<CreateTeamDTO>): Promise<Team | null> {
    const team = await this.getTeamById(id);
    if (!team) return null;

    Object.assign(team, dto);
    return await this.repo.save(team);
  }

  async deleteTeam(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
