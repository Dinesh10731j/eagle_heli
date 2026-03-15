import { Request, Response } from "express";
import { AuthService } from "../../service/user/auth.service";
import { AuthRepository } from "../../repository/user/auth.repository";
import { ForgotPasswordDTO, ResetPasswordDTO, SignInDTO, SignUpDTO } from "../../dto/user/user.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { HTTP_STATUS } from "../../constant/statusCode.interface";
import { Message } from "../../constant/message.interface";
import { ServiceResult } from "../../types/service_result";

// Initialize AuthService
const authRepo = new AuthRepository();
const authService = new AuthService(authRepo);

export class AuthController {
  static async signup(req: Request, res: Response) {
  try {
    const dto = plainToInstance(SignUpDTO, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);

    // Call your AuthService to create user and get tokens
    const { user, access_token, refresh_token } = await authService.signup(dto);

    // Set cookies
    res
      .cookie("access_token", access_token, {
        httpOnly: true,
        secure: true, // use true in production (HTTPS)
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(HTTP_STATUS.CREATED)
      .json({ message: Message.USER_CREATED_SUCCESS, user });
  } catch (err: any) {
    const msg = err?.message === Message.USER_ALREADY_EXISTS ? Message.USER_ALREADY_EXISTS : Message.INVALID_REQUEST;
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: msg });
  }
}

static async signin(req: Request, res: Response) {
  try {
    const dto = plainToInstance(SignInDTO, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);

    // Calling   AuthService to validate user and get tokens
    const { access_token, refresh_token } = await authService.signin(dto);

    // Set cookies
    res
      .cookie("access_token", access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(HTTP_STATUS.OK)
      .json({ message: Message.LOGIN_SUCCESS });
  } catch (err: any) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: Message.INVALID_EMAIL_OR_PASSWORD });
  }
}

static async forgotPassword(req: Request, res: Response) {
  try {
    const dto = plainToInstance(ForgotPasswordDTO, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);

    const result: ServiceResult<null> = await authService.forgotPassword(dto.email);
    if (result.status === HTTP_STATUS.NOT_FOUND) {
      return res.status(result.status).json({ message: Message.USER_NOT_FOUND });
    }
    if (result.status !== HTTP_STATUS.OK) {
      return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
    return res.status(result.status).json({ message: Message.RESET_EMAIL_SENT });
  } catch (err: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
  }
}

static async resetPassword(req: Request, res: Response) {
  try {
    const dto = plainToInstance(ResetPasswordDTO, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);
    if (dto.password !== dto.confirmPassword) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: Message.INVALID_REQUEST });
    }

    const result: ServiceResult<null> = await authService.resetPassword(dto.email, dto.token, dto.password);
    if (result.status === HTTP_STATUS.NOT_FOUND) {
      return res.status(result.status).json({ message: Message.USER_NOT_FOUND });
    }
    if (result.status === HTTP_STATUS.BAD_REQUEST) {
      return res.status(result.status).json({ message: Message.RESET_TOKEN_INVALID });
    }
    if (result.status !== HTTP_STATUS.OK) {
      return res.status(result.status).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
    return res.status(result.status).json({ message: Message.PASSWORD_RESET_SUCCESS });
  } catch (err: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
  }
}
}
