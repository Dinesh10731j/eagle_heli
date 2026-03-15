import { Router } from "express";
import { SeoMetaDataController } from "../../controller/seo_meta_data/seo_meta_data.controller";
import { VerifyToken } from "../../middleware/authentication";
import { CheckRole } from "../../middleware/check_role";

const router = Router();

router.post("/create", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, SeoMetaDataController.createSeoMetaData);
router.get("/get-all", SeoMetaDataController.getAllSeoMetaData);
router.get("/:id", SeoMetaDataController.getSeoMetaDataById);
router.put("/update/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, SeoMetaDataController.updateSeoMetaData);
router.delete("/delete/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, SeoMetaDataController.deleteSeoMetaData);

export default router;
