import { Router } from "express";
import {
  registerEmployee,
  loginEmployee,
  verifyOTP,
} from "../controllers/employee.controllers";
import { validate } from "../middlewares/validate.middleware";
import {
  registerSchema,
  loginSchema,
  verifyOTPSchema,
} from "../validators/auth.validator";

const router = Router();

router.route("/create").post(validate(registerSchema), registerEmployee);
router.route("/login").post(validate(loginSchema), loginEmployee);
router.route("/verifyOTP").post(validate(verifyOTPSchema), verifyOTP);

export default router;
