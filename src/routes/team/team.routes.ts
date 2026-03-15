import { Router } from "express";
import { TeamController } from "../../controller/team/team.controller";
import { upload } from "../../middleware/upload";
import { VerifyToken } from "../../middleware/authentication";
import { CheckRole } from "../../middleware/check_role";

const router = Router();

router.post(
  "/create",
  VerifyToken.authenticate,
  CheckRole.isAdminOrSudoAdmin,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  TeamController.createTeam
);
router.get("/get-all", TeamController.getAllTeam);
router.get("/:id", TeamController.getTeamById);
router.put(
  "/update/:id",
  VerifyToken.authenticate,
  CheckRole.isAdminOrSudoAdmin,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  TeamController.updateTeam
);
router.delete("/delete/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, TeamController.deleteTeam);

export default router;
