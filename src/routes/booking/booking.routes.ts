import { Router } from "express";
import { BookingController } from "../../controller/booking/booking.controller";
import { VerifyToken } from "../../middleware/authentication";
import { CheckRole } from "../../middleware/check_role";
import { verifyCaptcha } from "../../middleware/captcha_verification";

const router = Router();

router.post("/create", verifyCaptcha, BookingController.createBooking);
router.get("/get-all", BookingController.getAllBookings);
router.get("/:id", BookingController.getBookingById);
router.put("/update/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, BookingController.updateBooking);
router.delete("/delete/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, BookingController.deleteBooking);

export default router;
