import { IsString, IsDateString } from "class-validator";

export class CreateFlightScheduleDTO {

  @IsString()
  flightNumber!: string;

  @IsString()
  departure!: string;

  @IsString()
  destination!: string;

  @IsDateString()
  departureTime!: Date;

  @IsDateString()
  arrivalTime!: Date;

}