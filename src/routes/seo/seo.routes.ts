import { Router } from "express";
import { SeoController } from "../../controller/seo/seo.controller";
import { VerifyToken } from "../../middleware/authentication";
import { CheckRole } from "../../middleware/check_role";

const router = Router();

router.post("/create", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, SeoController.createSeo);
router.get("/get-all", SeoController.getAllSeo);
router.get("/:id", SeoController.getSeoById);
router.put("/update/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, SeoController.updateSeo);
router.delete("/delete/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, SeoController.deleteSeo);

export default router;
