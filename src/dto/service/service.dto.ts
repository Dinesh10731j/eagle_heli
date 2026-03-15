import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateServiceDTO {
  @IsString()
  @IsNotEmpty({ message: "Title is required" })
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: "Image must be a valid URL" })
  image?: string;
}
