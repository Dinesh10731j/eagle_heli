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