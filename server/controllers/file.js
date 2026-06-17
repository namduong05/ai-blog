import streamUpload from "../utils/streamUpload.js";
import File from "../models/File.js";
import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ code: 400, status: false, message: "No files uploaded" });
    }

    const result = await streamUpload(req.file.buffer, {
      folder: "blog_images",
    });

    if (!result) {
      return res
        .status(504)
        .json({ code: 504, status: false, message: "Failed to upload file" });
    }

    const imageUrl = result.secure_url;
    const publicId = result.public_id;

    const newFile = new File({
      url: imageUrl,
      imageId: publicId,
      createdBy: req.user.id,
    });
    await newFile.save();

    res.status(200).json({
      message: "Upload success",
      fileId: newFile._id,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    const { fileId, imageId } = req.body;

    await Promise.all([
      cloudinary.uploader.destroy(imageId),
      File.findByIdAndDelete(fileId),
      User.findOneAndUpdate({ profilePic: fileId }, { profilePic: null }),
    ]);

    res.status(200).json({
      message: "File deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { uploadFile, deleteFile };
