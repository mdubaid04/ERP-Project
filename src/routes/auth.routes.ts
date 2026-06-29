import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import {
  loginSchema,
  verifyOTPSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
} from "../validators/auth.validator";
import { verifyJwt } from "../middlewares/auth.middleware";
import {
  loginEmployee,
  logout,
  refreshAccessToken,
  verifyOTP,
  forgetPassword,
  resetPassword,
} from "../controllers/auth.controller";

const router = Router();

router.route("/login").post(validate(loginSchema), loginEmployee);
router.route("/verifyOTP").post(validate(verifyOTPSchema), verifyOTP);
router.route("/logout").post(verifyJwt, logout);
router.route("/refresh-access-token").post(verifyJwt, refreshAccessToken);
router
  .route("/forget-password")
  .post(validate(forgetPasswordSchema), forgetPassword);
router
  .route("/reset-password")
  .post(validate(resetPasswordSchema), resetPassword);

export default router;
