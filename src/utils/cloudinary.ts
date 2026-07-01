import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (
  fileLocalPath: string
): Promise<UploadApiResponse | null> => {
  if (!fileLocalPath || fileLocalPath.trim() === "") return null;
  try {
    const result: UploadApiResponse = await cloudinary.uploader.upload(
      fileLocalPath,
      {
        resource_type: "auto",
      }
    );
    console.log(result);
    return result;
  } catch (error) {
    console.error("Cloudinary upload error", error);
    return null;
  } finally {
    fs.unlinkSync(fileLocalPath);
  }
};

const deleteFromCloudinary = async (publicId: string) => {
  if (!publicId) return;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
