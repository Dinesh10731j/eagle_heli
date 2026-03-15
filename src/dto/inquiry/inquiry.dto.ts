import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateInquiryDTO {
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
  service?: string;

  @IsString()
  @IsNotEmpty({ message: "Message is required" })
  message!: string;
}
