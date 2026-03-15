import { Router } from "express";
import { GalleryController } from "../../controller/gallery/gallery.controller";
import { upload } from "../../middleware/upload";

const router = Router();

router.post(
  "/create",
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
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  GalleryController.updateGallery
);
router.delete("/delete/:id", GalleryController.deleteGallery);

export default router;
