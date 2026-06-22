import jwt from "jsonwebtoken";
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN as string;
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN as string;

export const generateAccessToken = (
  id: string,
  name: string,
  email: string,
  role: string
) =>
  // @ts-ignore
  jwt.sign({ id, name, email, role }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });

export const generateRefreshToken = (id: string) =>
  // @ts-ignore
  jwt.sign({ id }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
