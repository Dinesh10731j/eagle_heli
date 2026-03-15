import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { CountryCodeValidation } from "../decorator/country_code_validation";

@Entity("flight_booking")
export class FlightBooking {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  flightNumber!: string;

  @Column()
  departure!: string;

  @Column()
  destination!: string;

  @Column({ type: "timestamp" })
  departureTime!: Date;

  @Column({ type: "timestamp" })
  arrivalTime!: Date;

  @Column()
  bookedBy!: string; // user who booked

  @Column()
  email!: string; // user email

  @Column()
  @CountryCodeValidation()
  phoneNumber!: string; // user phone number

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  bookedAt!: Date; // booking timestamp

  @Column({ default: "confirmed" })
  status!: "confirmed" | "pending" | "cancelled";
}
