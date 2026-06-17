import z from "zod";
import { objectIdSchema } from "../utils/checkId.js";

const signupSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

const signinSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

const emailSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
  }),
});

const verifyUserSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    code: z
      .string()
      .min(6, "Verification code must be at least 6 characters long"),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    code: z.string().min(6, "Reset code must be at least 6 characters long"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters long"),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters long"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters long"),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    profilePic: objectIdSchema.optional(),
  }),
});

export {
  signupSchema,
  signinSchema,
  emailSchema,
  verifyUserSchema,
  forgotPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
};
