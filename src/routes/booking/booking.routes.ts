import { Router } from "express";
import { BookingController } from "../../controller/booking/booking.controller";

const router = Router();

router.post("/create", BookingController.createBooking);
router.get("/get-all", BookingController.getAllBookings);
router.get("/:id", BookingController.getBookingById);
router.put("/update/:id", BookingController.updateBooking);
router.delete("/delete/:id", BookingController.deleteBooking);

export default router;