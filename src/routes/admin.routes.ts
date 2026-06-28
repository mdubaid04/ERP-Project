import { Router } from "express";
import { registerEmployee } from "../controllers/admin.controllers";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema } from "../validators/auth.validator";

const router = Router();

router.route("/create").post(validate(registerSchema), registerEmployee);

export default router;
