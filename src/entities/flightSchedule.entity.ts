import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
@Entity("flight_schedule")
export class FlightSchedule {

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
}