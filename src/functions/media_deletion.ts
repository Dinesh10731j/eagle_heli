import { cloudinary } from "../configs/cloudinary.config";

export const deleteFromCloudinary = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId);
};
