import { IsString, IsNotEmpty, IsOptional, IsUrl } from "class-validator";

export class CreateGalleryDTO {
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

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  date?: string; 
}
