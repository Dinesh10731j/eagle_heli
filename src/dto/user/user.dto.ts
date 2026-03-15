import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

/**
 * DTO for signing up a user
 */
export class SignUpDTO {
  @IsNotEmpty({ message: "Name is required" })
  name!: string;

  @IsEmail({}, { message: "Invalid email address" })
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(6, { message: "Password must be at least 6 characters" })
  password!: string;
}

/**
 * DTO for signing in a user
 */
export class SignInDTO {
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  password!: string;
}

/**
 * DTO for forgot password
 */
export class ForgotPasswordDTO {
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;
}

/**
 * DTO for reset password
 */
export class ResetPasswordDTO {
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;

  @IsNotEmpty({ message: "Reset token is required" })
  token!: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(6, { message: "Password must be at least 6 characters" })
  password!: string;

  @IsNotEmpty({ message: "Confirm password is required" })
  @MinLength(6, { message: "Confirm password must be at least 6 characters" })
  confirmPassword!: string;
}
