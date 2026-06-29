import * as z from "zod";

const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, "firstName can't be Empty")
    .max(15, "firstName can't be more than 15 characters"),
  lastName: z
    .string()
    .min(1, "lastName can't be Empty")
    .max(15, "lastName can't be more than 15 characters"),
  email: z.email("Invalid email format"),
  phoneNo: z.e164("Invalid phone number format"),
  password: z
    .string()
    .min(8, "password must be at least 8 characters long")
    .regex(/[A-Z]/, "password must contain at least one uppercase letter")
    .regex(/[0-9]/, "password must contain at least one digit")
    .regex(
      /[!@#$%^&*]/,
      "password must contain at least one special character"
    ),
  role: z
    .enum(
      ["ADMIN", "MANAGER", "TEAM_LEADER", "EMPLOYEE"],
      "role can't be empty"
    )
    .default("EMPLOYEE"),
  gender: z.enum(["MALE", "FEMALE"], "gender can't be empty").default("MALE"),
  address: z
    .string()
    .min(1, "address can't be empty")
    .max(50, "address can't be more than 50 characters")
    .optional(),
  city: z
    .string()
    .min(1, "city can't be empty")
    .max(15, "city can't be more than 15 characters")
    .optional(),
  state: z
    .string()
    .min(1, "state can't be empty")
    .max(15, "state can't be more than 15 characters").optional,
  pinCode: z
    .string()
    .min(1, "pinCode can't be empty")
    .max(15, "pinCode can't be more than 15 characters")
    .optional(),
  dateOfBirth: z.date("dateOfBirth can't be empty"),
  profilePic: z.string().optional(),
});

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
  registerSchema,
  loginSchema,
  verifyOTPSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
};
