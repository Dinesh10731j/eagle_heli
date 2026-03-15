import { Router } from "express";
import { NewsLetterController } from "../../controller/news_letter/news_letter.controller";
import { VerifyToken } from "../../middleware/authentication";
import { CheckRole } from "../../middleware/check_role";
import { verifyCaptcha } from "../../middleware/captcha_verification";

const router = Router();

router.post("/create", verifyCaptcha, NewsLetterController.createSubscription);
router.get("/get-all", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, NewsLetterController.getAllSubscriptions);
router.get("/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, NewsLetterController.getSubscriptionById);
router.delete("/delete/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, NewsLetterController.deleteSubscription);

export default router;
