import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, verifyOTPSchema } from "../validators/auth.validator";
import { verifyJwt } from "../middlewares/auth.middleware";
import {
  loginEmployee,
  logout,
  refreshAccessToken,
  verifyOTP,
} from "../controllers/auth.controller";

const router = Router();

router.route("/login").post(validate(loginSchema), loginEmployee);
router.route("/verifyOTP").post(validate(verifyOTPSchema), verifyOTP);
router.route("/logout").post(verifyJwt, logout);
router.route("/refresh-access-token").post(verifyJwt, refreshAccessToken);

export default router;
