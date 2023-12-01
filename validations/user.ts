import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required and must be a valid email address",
    })
    .email(),
  password: z
    .string({
      required_error:
        "Password is required and must be at least 6 characters long",
    })
    .min(6, "Password is required and must be at least 6 characters long"),
});

export const registerSchema = z.object({
  email: z
    .string({
      required_error: "Email is required and must be a valid email address",
    })
    .email(),
  password: z
    .string({
      required_error:
        "Password is required and must be at least 6 characters long",
    })
    .min(6, "Password is required and must be at least 6 characters long"),
  name: z.string().min(2, "Name is required and must be at least 2 characters"),
});

export const resetPasswordSchema = z.object({
  email: z
    .string({
      required_error: "Email is required and must be a valid email address",
    })
    .email(),
});

export const newPasswordSchema = z.object({
  password: z
    .string({
      required_error:
        "Password is required and must be at least 6 characters long",
    })
    .min(6, "Password is required and must be at least 6 characters long"),
  code: z.string().min(6, "Code is required and must be at least 6 characters"),
});
