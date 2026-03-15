import { Router } from "express";
import { GalleryController } from "../../controller/gallery/gallery.controller";
import { upload } from "../../middleware/upload";
import { VerifyToken } from "../../middleware/authentication";
import { CheckRole } from "../../middleware/check_role";

const router = Router();

router.post(
  "/create",
  VerifyToken.authenticate,
  CheckRole.isAdminOrSudoAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  GalleryController.createGallery
);
router.get("/get-all", GalleryController.getAllGallery);
router.get("/:id", GalleryController.getGalleryById);
router.put(
  "/update/:id",
  VerifyToken.authenticate,
  CheckRole.isAdminOrSudoAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  GalleryController.updateGallery
);
router.delete("/delete/:id", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, GalleryController.deleteGallery);

export default router;
