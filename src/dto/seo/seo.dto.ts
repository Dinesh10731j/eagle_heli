import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSeoDTO {
  @IsString()
  @IsNotEmpty({ message: "Page is required" })
  page!: string;

  @IsString()
  @IsNotEmpty({ message: "Title is required" })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: "Description is required" })
  description!: string;

  @IsString()
  @IsOptional()
  keywords?: string;
}
