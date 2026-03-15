import { Router } from "express";
import { PackageController } from "../../controller/package/package.controller";
import { VerifyToken } from "../../middleware/authentication";
import { CheckRole } from "../../middleware/check_role";
import { upload } from "../../middleware/upload";

const router = Router();

router.post(
  "/create",
  VerifyToken.authenticate,
  CheckRole.isAdminOrSudoAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  PackageController.createPackage
);
router.get("/get-all", PackageController.getAllPackages);
router.get("/:id", PackageController.getPackageById);
router.put(
  "/update/:id",
  VerifyToken.authenticate,
  CheckRole.isAdminOrSudoAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  PackageController.updatePackage
);
router.delete("/delete/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, PackageController.deletePackage);

export default router;
