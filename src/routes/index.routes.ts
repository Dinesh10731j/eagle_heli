import { Router } from "express";
import AuthRouter from "./authentication/auth.routes";
import FlightScheduleRouter from "./flight_schedule/flight_schedule.routes";
import FlightBookingRouter from "./booking/booking.routes"
import GalleryRouter from "./gallery/gallery.routes";


const router = Router();

router.use("/auth", AuthRouter);
router.use("/flight-schedule", FlightScheduleRouter);
router.use('/flight-booking', FlightBookingRouter)
router.use("/gallery", GalleryRouter);

export default router;
