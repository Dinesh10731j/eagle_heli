import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateSeoMetaDataDTO {
  @IsString()
  @IsNotEmpty({ message: "Page is required" })
  page!: string;

  @IsString()
  @IsNotEmpty({ message: "Meta title is required" })
  metaTitle!: string;

  @IsString()
  @IsNotEmpty({ message: "Meta description is required" })
  metaDescription!: string;

  @IsString()
  @IsOptional()
  metaKeywords?: string;

  @IsString()
  @IsOptional()
  ogTitle?: string;

  @IsString()
  @IsOptional()
  ogDescription?: string;

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: "OG image must be a valid URL" })
  ogImage?: string;
}
