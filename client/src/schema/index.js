import { z } from "zod";

const SignUpSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const categorySchema = z.object({
  title: z.string().min(1, "Title is required"),
  desc: z.string().optional(),
});

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  desc: z.string().optional(),
  file: z
    .any()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;

      const file = files?.[0];
      return file.type.startsWith("image/");
    }, "Must select image file (jpg /jepg ,png ,...)")
    .refine((files) => {
      if (!files || files.length === 0) return true;

      return files[0].size <= 2 * 1024 * 1024;
    }, "File size limit: 2MB"),
  category: z.string().min(1, "Category is required"),
});

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    error: "Please enter your new password.!",
    path: ["newPassword"],
  });

const verifyUserSchema = z.object({
  code: z.string(),
});

const sendCodeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetWithCodeSchema = z.object({
  code: z.string().length(6, "The verification code must be exactly 6 digits."),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export {
  SignUpSchema,
  SignInSchema,
  categorySchema,
  postSchema,
  profileSchema,
  changePasswordSchema,
  verifyUserSchema,
  sendCodeSchema,
  resetWithCodeSchema,
};
