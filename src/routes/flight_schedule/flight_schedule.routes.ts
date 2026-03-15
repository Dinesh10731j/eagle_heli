import { Router } from "express";
import { FlightScheduleController } from "../../controller/flight_schedule/flight_schedule.controller";

const router = Router();

router.post("/create", FlightScheduleController.createSchedule);
router.get("/get-flight-schedule", FlightScheduleController.getAllSchedules);
router.get("/:id", FlightScheduleController.getScheduleById);
router.put("/update/:id", FlightScheduleController.updateSchedule);
router.delete("/delete/:id", FlightScheduleController.deleteSchedule);

export default router;