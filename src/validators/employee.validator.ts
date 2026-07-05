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
    .regex(/[!@#$%^&*]/, "password must contain at least one special character")
    .optional(),
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
    .max(15, "state can't be more than 15 characters")
    .optional(),
  pinCode: z
    .string()
    .min(1, "pinCode can't be empty")
    .max(15, "pinCode can't be more than 15 characters")
    .optional(),
  dateOfBirth: z.coerce.date("dateOfBirth can't be empty"),
  profilePic: z.string().optional(),
});

const updateSchema = z.object({
  firstName: z
    .string()
    .min(1, "firstName can't be Empty")
    .max(15, "firstName can't be more than 15 characters")
    .optional(),
  lastName: z
    .string()
    .min(1, "lastName can't be Empty")
    .max(15, "lastName can't be more than 15 characters")
    .optional(),
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
    .max(15, "state can't be more than 15 characters")
    .optional(),
  pinCode: z
    .string()
    .min(1, "pinCode can't be empty")
    .max(8, "pinCode can't be more than 8 characters")
    .optional(),
});

const updatePasswordSchema = z.object({
  oldPassword: z.string().min(1, "oldPassword can't be empty"),
  newPassword: z
    .string()
    .min(8, "newPassword must be at least 8 characters long")
    .regex(/[A-Z]/, "newPassword must contain at least one uppercase letter")
    .regex(/[0-9]/, "newPassword must contain at least one digit")
    .regex(
      /[!@#$%^&*]/,
      "newPassword must contain at least one special character"
    ),
});

const createUpdateRequestSchema = z
  .object({
    fieldName: z.enum(["Email", "phoneNo"], "fieldName can't be empty"),
    newValue: z.string().min(1, "newValue can't be empty"),
  })
  .superRefine((data, ctx) => {
    if (data.fieldName === "Email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.newValue)) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid email format",
          path: ["newValue"],
        });
      }
    } else if (data.fieldName === "phoneNo") {
      const phoneNoRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneNoRegex.test(data.newValue)) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid phone number format",
          path: ["newValue"],
        });
      }
    }
  });

const leaveRequestSchema = z.object({
  startDate: z.coerce.date("startDate can't be empty"),
  endDate: z.coerce.date("endDate can't be empty"),
  reason: z.string().min(1, "reason can't be empty"),
  leaveType: z.enum(["SICK", "CASUAL", "UNPAID"], "leaveType can't be empty"),
});

const createQualificationSchema = z.object({
  degree: z
    .string()
    .min(1, "degree can't be empty")
    .max(30, "degree can't be more than 30 characters"),
  university: z
    .string()
    .min(1, "university can't be empty")
    .max(30, "university can't be more than 30 characters"),
  passingYear: z.number("passingYear can't be empty"),
  grade: z.string().min(1, "grade can't be empty"),
});

const updateQualificationSchema = z.object({
  degree: z
    .string()
    .min(1, "degree can't be empty")
    .max(30, "degree can't be more than 30 characters")
    .optional(),
  university: z
    .string()
    .min(1, "university can't be empty")
    .max(30, "university can't be more than 30 characters")
    .optional(),
  passingYear: z.number("passingYear can't be empty").optional(),
  grade: z.string().min(1, "grade can't be empty").optional(),
});

export {
  registerSchema,
  updateSchema,
  updatePasswordSchema,
  createUpdateRequestSchema,
  leaveRequestSchema,
  createQualificationSchema,
  updateQualificationSchema,
};
