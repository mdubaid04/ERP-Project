import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, verifyOTPSchema } from "../validators/auth.validator";
import { loginEmployee, verifyOTP } from "../controllers/auth.controller";

const router = Router();

router.route("/login").post(validate(loginSchema), loginEmployee);
router.route("/verifyOTP").post(validate(verifyOTPSchema), verifyOTP);

export default router;
