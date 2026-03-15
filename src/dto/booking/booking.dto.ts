import { IsString, IsDateString, IsOptional, IsEmail } from "class-validator";
import { CountryCodeValidation } from "../../decorator/country_code_validation";

export class CreateBookingDTO {
  @IsString()
  flightNumber!: string;

  @IsString()
  departure!: string;

  @IsString()
  destination!: string;

  @IsDateString()
  departureTime!: string; // ISO date string in request

  @IsDateString()
  arrivalTime!: string; // ISO date string

  @IsString()
  bookedBy!: string; // user who booked

  @IsEmail()
  email!: string; // user's email

  @CountryCodeValidation()
  phoneNumber!: string; // user's phone number

  @IsOptional()
  @IsDateString()
  bookedAt?: string; // optional booking timestamp
}