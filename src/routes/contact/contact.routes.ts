import { Router } from "express";
import { ContactController } from "../../controller/contact/contact.controller";
import { VerifyToken } from "../../middleware/authentication";
import { CheckRole } from "../../middleware/check_role";
import { verifyCaptcha } from "../../middleware/captcha_verification";

const router = Router();

router.post("/create", verifyCaptcha, ContactController.createContact);
router.get("/get-all", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, ContactController.getAllContacts);
router.get("/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, ContactController.getContactById);
router.put("/update/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, ContactController.updateContact);
router.delete("/delete/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, ContactController.deleteContact);

export default router;
