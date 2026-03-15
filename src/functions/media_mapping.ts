import { cloudinary } from "../configs/cloudinary.config";

export const uploadToCloudinary = async (filePath: string, folder: string) => {
  const result = await cloudinary.uploader.upload(filePath, { folder });
  return result.secure_url;
};
