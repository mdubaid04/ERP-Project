import jwt from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums";
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const ACCESS_EXPIRES_IN = (process.env.ACCESS_TOKEN_EXPIRY as string) || "1d";
const REFRESH_EXPIRES_IN = (process.env.REFRESH_TOKEN_EXPIRY as string) || "7d";

export const generateAccessToken = (
  emp_id: number,
  firstName: string,
  lastName: string,
  email: string,
  role: Role
) =>
  // @ts-ignore
  jwt.sign({ emp_id, firstName, lastName, email, role }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });

export const generateRefreshToken = (emp_id: number) =>
  // @ts-ignore
  jwt.sign({ emp_id }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
