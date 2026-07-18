import * as z from "zod";

const loginSchema = z.object({
  email: z.email("Invalid email format"),
  phoneNo: z.e164("Invalid phone number format").optional(),
  password: z.string().min(8, "password must be at least 8 characters long"),
});

const verifyOTPSchema = z.object({
  otp: z.string().length(7, "OTP must be 7 digits"),
});

const forgetPasswordSchema = z.object({
  email: z.email("Invalid email format"),
  phoneNo: z.e164("Invalid phone number format").optional(),
});

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "password must be at least 8 characters long")
    .regex(/[A-Z]/, "password must contain at least one uppercase letter")
    .regex(/[0-9]/, "password must contain at least one digit")
    .regex(
      /[!@#$%^&*]/,
      "password must contain at least one special character"
    ),
  otp: z.string().length(7, "OTP must be 7 digits"),
});
export {
  loginSchema,
  verifyOTPSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
};
