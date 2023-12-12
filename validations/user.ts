import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string({
      required_error:
        "Username is required and must be a valid email address or phone number",
    })
    .refine(
      (val) => {
        // If the value includes '@', validate as an email
        if (val.includes("@")) {
          return z.string().email().safeParse(val).success;
        }
        return z.string().min(6).max(13).safeParse(val).success;
      },
      {
        message: "Invalid username. It must be a valid email or phone number.",
      }
    ),

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
    .min(6, "Password is required and must be at least 6 characters long")
    .optional(),
  name: z.string().min(2, "Name is required and must be at least 2 characters"),
  phone: z
    .string({
      required_error:
        "Phone number is required and must be a valid phone number",
    })
    .min(6, "Phone number is required and must be at least 6 characters long"),
  status: z.optional(
    z.string().min(2, "Status is required and must be at least 2 characters")
  ),

  role: z.optional(
    z
      .string({
        required_error: "Role is required",
      })
      .min(2, "Role is required and must be at least 2 characters")
  ),
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
