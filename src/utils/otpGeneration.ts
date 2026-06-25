import crypto from "crypto";
const generatedOtp = (): string => {
  return crypto.randomInt(1000000, 9999999).toString();
};
const isOTPExpired = (expiryTime: Date): boolean => {
  if (new Date() > expiryTime) {
    return false;
  }
  return true;
};
export { generatedOtp, isOTPExpired };
