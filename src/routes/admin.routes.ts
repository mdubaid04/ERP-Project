import { Router } from "express";
import {
  registerEmployee,
  createDepartment,
  updateDepartment,
  getAllDepartments,
  getDepartmentById,
} from "../controllers/admin.controllers";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema } from "../validators/employee.validator";
import {
  createDeptSchema,
  updateDepartmentSchema,
} from "../validators/dept.validator";
import { authorizeRole } from "../middlewares/auth.middleware";
import { verifyJwt } from "../middlewares/auth.middleware";
import { get } from "node:http";

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

router
  .route("/update-dept")
  .put(
    verifyJwt,
    authorizeRole("ADMIN"),
    validate(updateDepartmentSchema),
    updateDepartment
  );

router
  .route("/get-departments")
  .get(verifyJwt, authorizeRole("ADMIN"), getAllDepartments);

router
  .route("/get-department/:deptId")
  .get(verifyJwt, authorizeRole("ADMIN"), getDepartmentById);

export default router;
