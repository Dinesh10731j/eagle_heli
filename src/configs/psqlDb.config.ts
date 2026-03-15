import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity"; 
import { FlightSchedule } from "../entities/flightSchedule.entity";
import { FlightBooking } from "../entities/booking.entity";
import { Gallery } from "../entities/gallery.entity";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5433,
  username: "postgres",
  password: "eagle_heli12",
  database: "eagle_heli",
  synchronize: true,
  logging: false,
  entities: [User, FlightSchedule, FlightBooking, Gallery], 
  migrations: [],
  subscribers: [],
});
