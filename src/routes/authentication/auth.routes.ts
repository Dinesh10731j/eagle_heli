import { Router } from "express";
import { AuthController } from "../../controller/user/auth.controller";

const router = Router();

router.post("/signup", AuthController.signup);
router.post("/signin", AuthController.signin);

export default router;