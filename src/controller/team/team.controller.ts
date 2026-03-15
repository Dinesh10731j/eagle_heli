import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateTeamDTO } from "../../dto/team/team.dto";
import { TeamRepository } from "../../repository/team/team.repository";
import { TeamService } from "../../service/team/team.service";
import { cloudinary } from "../../configs/cloudinary.config";
import fs from "fs";
import { getCache, setCache, delCache } from "../../utils/helpers/redis_helper";
import { HTTP_STATUS } from "../../constant/statusCode.interface";
import { Message } from "../../constant/message.interface";
import { ServiceResult } from "../../types/service_result";
import { Team } from "../../entities/team.entity";

const teamRepo = new TeamRepository();
const teamService = new TeamService(teamRepo);

export class TeamController {
  // Create team member
  static async createTeam(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateTeamDTO, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);
      }

      const files = (req as any).files as
        | Record<string, Express.Multer.File[]>
        | undefined;
      const file = files?.profileImage?.[0] || files?.image?.[0] || files?.file?.[0];
      if (!file?.path) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: Message.INVALID_REQUEST });
      }

      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "team",
      });
      await fs.promises.unlink(file.path);

      dto.profileImage = uploadResult.secure_url;

      const result: ServiceResult<Team> = await teamService.createTeam(dto);
      await delCache("team:all");

      if (result.status !== HTTP_STATUS.CREATED) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }

      return res.status(result.status).json({
        message: Message.CREATED,
        data: result.data,
      });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  // Get all team members
  static async getAllTeam(req: Request, res: Response) {
    try {
      const cached = await getCache<any[]>("team:all");
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({
          message: Message.FETCHED,
          isCached: true,
          data: cached.data,
        });
      }

      const result: ServiceResult<Team[]> = await teamService.getAllTeam();
      if (result.status !== HTTP_STATUS.OK) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await setCache("team:all", result.data, 300);
      return res.status(result.status).json({
        message: Message.FETCHED,
        isCached: false,
        data: result.data,
      });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  // Get team member by ID
  static async getTeamById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cacheKey = `team:${id}`;
      const cached = await getCache<any>(cacheKey);
      if (cached.cached && cached.data) {
        return res.status(HTTP_STATUS.OK).json({
          message: Message.FETCHED,
          isCached: true,
          data: cached.data,
        });
      }

      const result: ServiceResult<Team> = await teamService.getTeamById(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      if (result.status !== HTTP_STATUS.OK) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await setCache(cacheKey, result.data, 300);
      return res.status(result.status).json({
        message: Message.FETCHED,
        isCached: false,
        data: result.data,
      });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  // Update team member
  static async updateTeam(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto = plainToInstance(CreateTeamDTO, req.body);
      const errors = await validate(dto, { skipMissingProperties: true });

      if (errors.length > 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);
      }

      const files = (req as any).files as
        | Record<string, Express.Multer.File[]>
        | undefined;
      const file = files?.profileImage?.[0] || files?.image?.[0] || files?.file?.[0];
      if (file?.path) {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: "team",
        });
        await fs.promises.unlink(file.path);
        dto.profileImage = uploadResult.secure_url;
      }

      const result: ServiceResult<Team> = await teamService.updateTeam(Number(id), dto);
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      if (result.status !== HTTP_STATUS.OK) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await delCache("team:all");
      await delCache(`team:${id}`);
      return res.status(result.status).json({
        message: Message.UPDATED,
        data: result.data,
      });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }

  // Delete team member
  static async deleteTeam(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result: ServiceResult<null> = await teamService.deleteTeam(Number(id));
      if (result.status === HTTP_STATUS.NOT_FOUND) {
        return res.status(result.status).json({ message: Message.NOT_FOUND });
      }
      if (result.status !== HTTP_STATUS.OK) {
        return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
      }
      await delCache("team:all");
      await delCache(`team:${id}`);
      return res.status(result.status).json({ message: Message.DELETED });
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
  }
}
