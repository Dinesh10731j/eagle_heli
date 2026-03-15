import { Request, Response } from "express";
import { AuthService } from "../../service/user/auth.service";
import { AuthRepository } from "../../repository/user/auth.repository";
import { SignInDTO,SignUpDTO } from "../../dto/user/user.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

// Initialize AuthService
const authRepo = new AuthRepository();
const authService = new AuthService(authRepo);

export class AuthController {
  static async signup(req: Request, res: Response) {
  try {
    const dto = plainToInstance(SignUpDTO, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) return res.status(400).json(errors);

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
      .status(201)
      .json({ message: "User created successfully", user });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

static async signin(req: Request, res: Response) {
  try {
    const dto = plainToInstance(SignInDTO, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) return res.status(400).json(errors);

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
      .status(200)
      .json({ message: "Login successful" });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}
}