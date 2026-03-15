import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AuthRepository } from "../../repository/user/auth.repository";
import { User } from "../../entities/user.entity";
import { SignUpDTO, SignInDTO } from "../../dto/user/user.dto";
import { envConfig } from "../../configs/env.config";
import { enqueueEmail } from "../../jobs/email.jobs";
import { buildResetPasswordEmailJob } from "../../functions/email.functions";
import { HTTP_STATUS } from "../../constant/statusCode.interface";
import { ServiceResult } from "../../types/service_result";

// Destructure from envConfig with different variable names
const { ACCESS_TOKEN_SECRET: ENV_ACCESS_SECRET, REFRESH_TOKEN_SECRET: ENV_REFRESH_SECRET } = envConfig;

export class AuthService {
  private authRepo: AuthRepository;
  private accessTokenSecret: string;
  private refreshTokenSecret: string;

  constructor(authRepo: AuthRepository) {
    this.authRepo = authRepo;

    // Assign class properties safely
this.accessTokenSecret =  ENV_ACCESS_SECRET as string ;
if (!this.accessTokenSecret) throw new Error("ACCESS_TOKEN_SECRET not defined!");

this.refreshTokenSecret =  ENV_REFRESH_SECRET as string ;
if (!this.refreshTokenSecret) throw new Error("REFRESH_TOKEN_SECRET not defined!");
  }

  // Generate JWTs
  private generateAccessToken(user: User) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      this.accessTokenSecret,
      { expiresIn: "15m" }
    );
  }

  private generateRefreshToken(user: User) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      this.refreshTokenSecret,
      { expiresIn: "7d" }
    );
  }

  // Signup
  async signup(dto: SignUpDTO): Promise<{ user: User; access_token: string; refresh_token: string }> {
    const { email, password, name } = dto;

    const existingUser = await this.authRepo.findByEmail(email);
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.authRepo.createUser({
      name,
      email,
      password: hashedPassword,
    });

    const access_token = this.generateAccessToken(newUser);
    const refresh_token = this.generateRefreshToken(newUser);

    return { user: newUser, access_token, refresh_token };
  }

  // Signin
  async signin(dto: SignInDTO): Promise<{ user: User; access_token: string; refresh_token: string }> {
    const { email, password } = dto;

    const user = await this.authRepo.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const access_token = this.generateAccessToken(user);
    const refresh_token = this.generateRefreshToken(user);

    return { user, access_token, refresh_token };
  }

  async forgotPassword(email: string): Promise<ServiceResult<null>> {
    const user = await this.authRepo.findByEmail(email);
    if (!user) return { status: HTTP_STATUS.NOT_FOUND };

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expires;
    await this.authRepo.saveUser(user);

    const frontendUrl = envConfig.FRONTEND_URL || "http://localhost:3000";
    const resetLink = `${frontendUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(
      user.email
    )}`;

    await enqueueEmail(
      buildResetPasswordEmailJob({
        to: user.email,
        name: user.name,
        resetLink,
      })
    );

    return { status: HTTP_STATUS.OK };
  }

  async resetPassword(email: string, token: string, password: string): Promise<ServiceResult<null>> {
    const user = await this.authRepo.findByEmail(email);
    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
      return { status: HTTP_STATUS.NOT_FOUND };
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    if (user.resetPasswordToken !== hashedToken) {
      return { status: HTTP_STATUS.BAD_REQUEST };
    }

    if (user.resetPasswordExpires.getTime() < Date.now()) {
      return { status: HTTP_STATUS.BAD_REQUEST };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.authRepo.saveUser(user);

    return { status: HTTP_STATUS.OK };
  }
}
