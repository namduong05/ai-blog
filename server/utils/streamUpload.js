import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

const streamUpload = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    Readable.from(buffer).pipe(stream);
  });
};

export default streamUpload;
