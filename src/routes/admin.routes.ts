import { Router } from "express";
import {
  registerEmployee,
  createDepartment,
} from "../controllers/admin.controllers";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema } from "../validators/employee.validator";
import { createDeptSchema } from "../validators/dept.validator";
import { authorizeRole } from "../middlewares/auth.middleware";
import { verifyJwt } from "../middlewares/auth.middleware";

const router = Router();
router
  .route("/create-dept")
  .post(
    verifyJwt,
    authorizeRole("ADMIN"),
    validate(createDeptSchema),
    createDepartment
  );
router
  .route("/create-employee")
  .post(
    verifyJwt,
    authorizeRole("ADMIN"),
    validate(registerSchema),
    registerEmployee
  );

export default router;
