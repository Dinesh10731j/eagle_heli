import { Router } from "express";
import { AnalyticsController } from "../../controller/analytics/analytics.controller";
import { VerifyToken } from "../../middleware/authentication";
import { CheckRole } from "../../middleware/check_role";

const router = Router();

router.post("/create", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, AnalyticsController.createAnalytics);
router.get("/get-all", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, AnalyticsController.getAllAnalytics);
router.get("/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, AnalyticsController.getAnalyticsById);
router.put("/update/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, AnalyticsController.updateAnalytics);
router.delete("/delete/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, AnalyticsController.deleteAnalytics);

export default router;
