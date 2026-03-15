import { Router } from "express";
import { LogoutController } from "../../controller/logout/logout.controller";
import { VerifyToken } from "../../middleware/authentication";

const router = Router();

router.post("/", VerifyToken.authenticate, LogoutController.logout);

export default router;
