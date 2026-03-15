import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
export class CreateContactDTO {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()

  phone?: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsNotEmpty({ message: "Message is required" })
  message!: string;
}
