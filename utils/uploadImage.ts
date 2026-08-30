import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import { AppError } from "./appError";
const uploadImage = (
  buffer: Buffer,
  folder: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `food-ordering-app/${folder}` },
      (err, callResult) => {
        if (err) return reject(err);
        if (!callResult) {
          return reject(
            new AppError({ message: "Image upload failed", statusCode: 500 }),
          );
        }
        resolve(callResult);
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};
export default uploadImage;
