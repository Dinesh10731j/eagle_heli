import { Router } from "express";
import { ReplyController } from "../../controller/reply/reply.controller";
import { VerifyToken } from "../../middleware/authentication";
import { CheckRole } from "../../middleware/check_role";

const router = Router();

router.post("/create", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, ReplyController.createReply);
router.get("/get-all", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, ReplyController.getAllReplies);
router.get("/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, ReplyController.getReplyById);
router.put("/update/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, ReplyController.updateReply);
router.delete("/delete/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, ReplyController.deleteReply);

export default router;
