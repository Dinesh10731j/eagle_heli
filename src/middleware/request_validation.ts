import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constant/statusCode.interface";

export const validateBody =
  <T>(dto: ClassConstructor<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(dto, req.body);
    const errors = await validate(instance as object);
    if (errors.length > 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);
    }
    req.body = instance as any;
    return next();
  };
