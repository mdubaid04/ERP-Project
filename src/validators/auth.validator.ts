import * as z from "zod";

const registerSchema = z.object({
  firstName: z.string().min(1).max(15),
  lastName: z.string().min(1).max(15),
  email: z.email(),
  phoneNo: z.e164(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  role: z
    .enum(["ADMIN", "MANAGER", "TEAM_LEADER", "EMPLOYEE"])
    .default("EMPLOYEE"),
  gender: z.enum(["MALE", "FEMALE"]).default("MALE"),
  address: z.string().min(1).max(50),
  city: z.string().min(1).max(15),
  state: z.string().min(1).max(15),
  pinCode: z.string().min(1).max(15),
  departmentId: z.number(),
});

const loginSchema = z.object({
  email: z.email(),
  phoneNo: z.e164().optional(),
  password: z.string().min(8),
});

export { registerSchema, loginSchema };
