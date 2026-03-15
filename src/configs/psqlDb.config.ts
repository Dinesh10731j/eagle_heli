import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity"; 
import { FlightSchedule } from "../entities/flightSchedule.entity";
import { FlightBooking } from "../entities/booking.entity";
import { Gallery } from "../entities/gallery.entity";
import { Team } from "../entities/team.entity";
import { Contact } from "../entities/contact.entity";
import { Inquiry } from "../entities/inquiry.entity";
import { NewsLetter } from "../entities/news_letter.entity";
import { Package } from "../entities/package.entity";
import { Reply } from "../entities/reply.entity";
import { Seo } from "../entities/seo.entity";
import { SeoMetaData } from "../entities/seo_meta_data.entity";
import { Analytics } from "../entities/analytics.entity";
export const AppDataSource = new DataSource({
   type: "postgres",
  host: "localhost",
  port: 5433,
  username: "postgres",
  password: "eagle_heli12",
  database: "eagle_heli",
  synchronize: true,
  logging: false,
  entities: [
    User,
    FlightSchedule,
    FlightBooking,
    Gallery,
    Team,
    Contact,
    Inquiry,
    NewsLetter,
    Package,
    Reply,
    Seo,
    SeoMetaData,
    Analytics,
  ], 
  migrations: [],
  subscribers: [],
});
