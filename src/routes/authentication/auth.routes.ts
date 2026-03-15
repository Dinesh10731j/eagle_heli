import { Router } from "express";
import { AuthController } from "../../controller/user/auth.controller";
import { UserController } from "../../controller/user/user.controller";
import { VerifyToken } from "../../middleware/authentication";
import { CheckRole } from "../../middleware/check_role";

const router = Router();

router.post("/signup", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, AuthController.signup);
router.post("/signin", AuthController.signin);
router.post("/forgot-password", AuthController.forgotPassword);
router.patch("/reset-password", AuthController.resetPassword);
router.get("/me", VerifyToken.authenticate, UserController.getMe);
router.get("/users", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, UserController.getAllUsers);

export default router;
