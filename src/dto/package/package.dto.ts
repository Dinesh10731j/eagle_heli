import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

export class CreatePackageDTO {
  @IsString()
  @IsNotEmpty({ message: "Title is required" })
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" ? Number(value.replace(/[^0-9.]/g, "")) : value
  )
  price?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  durationDays?: number;

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: "Image must be a valid URL" })
  image?: string;
}
