import { Router } from "express";
import { FlightScheduleController } from "../../controller/flight_schedule/flight_schedule.controller";
import { VerifyToken } from "../../middleware/authentication";
import { CheckRole } from "../../middleware/check_role";

const router = Router();

router.post("/create", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, FlightScheduleController.createSchedule);
router.get("/get-flight-schedule", FlightScheduleController.getAllSchedules);
router.get("/:id", FlightScheduleController.getScheduleById);
router.put("/update/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, FlightScheduleController.updateSchedule);
router.delete("/delete/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, FlightScheduleController.deleteSchedule);

export default router;
