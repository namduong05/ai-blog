import express from "express";
import * as fileControllers from "../controllers/file.js";
import { isAuth } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post(
  "/upload",
  isAuth,
  upload.single("image"),
  fileControllers.uploadFile,
);

router.delete("/delete", isAuth, fileControllers.deleteFile);

export default router;
