import { Router } from "express";
import { PackageController } from "../../controller/package/package.controller";
import { VerifyToken } from "../../middleware/authentication";
import { CheckRole } from "../../middleware/check_role";

const router = Router();

router.post("/create", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, PackageController.createPackage);
router.get("/get-all", PackageController.getAllPackages);
router.get("/:id", PackageController.getPackageById);
router.put("/update/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, PackageController.updatePackage);
router.delete("/delete/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, PackageController.deletePackage);

export default router;
