import jwt from "jsonwebtoken";

const tempToken = (email: string) => {
  // @ts-ignore
  return jwt.sign({ email }, process.env.TEMP_JWT_ACCESS_SECRET as string, {
    expiresIn: process.env.TEMP_JWT_EXPIRY! || "5m",
  });
};

export default tempToken;
