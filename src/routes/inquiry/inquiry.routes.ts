import { Router } from "express";
import { InquiryController } from "../../controller/inquiry/inquiry.controller";
import { VerifyToken } from "../../middleware/authentication";
import { CheckRole } from "../../middleware/check_role";

const router = Router();

router.post("/create", InquiryController.createInquiry);
router.get("/get-all", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, InquiryController.getAllInquiries);
router.get("/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, InquiryController.getInquiryById);
router.put("/update/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, InquiryController.updateInquiry);
router.delete("/delete/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, InquiryController.deleteInquiry);

export default router;
