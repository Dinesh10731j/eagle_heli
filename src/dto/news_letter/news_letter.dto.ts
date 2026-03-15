import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateNewsLetterDTO {
  @IsEmail()
  email!: string;
}

export class SendNewsLetterDTO {
  @IsNotEmpty({ message: "Subject is required" })
  subject!: string;

  @IsNotEmpty({ message: "Content is required" })
  content!: string;

  @IsOptional()
  title?: string;
}
