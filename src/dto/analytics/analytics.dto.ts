import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAnalyticsDTO {
  @IsString()
  @IsNotEmpty({ message: "Event is required" })
  event!: string;

  @IsString()
  @IsNotEmpty({ message: "Path is required" })
  path!: string;

  @IsString()
  @IsOptional()
  referrer?: string;

  @IsString()
  @IsOptional()
  userAgent?: string;

  @IsString()
  @IsOptional()
  ip?: string;
}
