import { IsEmail } from "class-validator";

export class CreateNewsLetterDTO {
  @IsEmail()
  email!: string;
}
