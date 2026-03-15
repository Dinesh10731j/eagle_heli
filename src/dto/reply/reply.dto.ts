import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateReplyDTO {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty({ message: "Message is required" })
  message!: string;

  @IsString()
  @IsOptional()
  relatedTo?: string;
}
