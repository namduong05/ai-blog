import express from "express";
import * as authControllers from "../controllers/auth.js";
import validate from "../middlewares/validation.js";
import {
  signupSchema,
  signinSchema,
  emailSchema,
  verifyUserSchema,
  forgotPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
} from "../validators/auth.js";
import { isAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), authControllers.signup);

router.post("/signin", validate(signinSchema), authControllers.signin);

router.post("/refresh", authControllers.refresh);

router.post(
  "/send-verification-email",
  validate(emailSchema),
  authControllers.verifyCode,
);

router.post(
  "/verify-user",
  validate(verifyUserSchema),
  authControllers.verifyUser,
);

router.post(
  "/forgot-password",
  validate(emailSchema),
  authControllers.forgotPassword,
);

router.post(
  "/reset-password",
  validate(forgotPasswordSchema),
  authControllers.resetPassword,
);

router.put(
  "/change-password",
  validate(changePasswordSchema),
  isAuth,
  authControllers.changePassword,
);

router.put(
  "/update-profile",
  validate(updateProfileSchema),
  isAuth,
  authControllers.updateProfile,
);

export default router;
