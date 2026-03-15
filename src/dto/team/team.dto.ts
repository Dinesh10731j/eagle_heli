import { IsString, IsNotEmpty, IsOptional, IsUrl } from "class-validator";

export class CreateTeamDTO {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  name!: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: "Profile image must be a valid URL" })
  profileImage?: string;
}
