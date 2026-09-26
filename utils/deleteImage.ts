import { v2 as cloudinary } from "cloudinary";

export const deleteImage = async (public_id: string) => {
  try {
    if (!public_id) return;
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error(error);
  }
};
