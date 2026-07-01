import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import {
  createUpdateRequest,
  getEmployee,
  leaveRequest,
  updateProfileItself,
} from "../controllers/employee.controllers";
import { verifyJwt } from "../middlewares/auth.middleware";
import {
  createUpdateRequestSchema,
  leaveRequestSchema,
  updatePasswordSchema,
  updateSchema,
} from "../validators/employee.validator";

const router = Router();
router.route("/").get(verifyJwt, getEmployee);

router
  .route("/update-details")
  .put(verifyJwt, validate(updateSchema), updateProfileItself);

router.route("/update-profile-pic").put(verifyJwt, updateProfileItself);

router
  .route("/update-password")
  .put(verifyJwt, validate(updatePasswordSchema), updateProfileItself);

router
  .route("/update-request")
  .put(verifyJwt, validate(createUpdateRequestSchema), createUpdateRequest);

router
  .route("/leave-request")
  .post(verifyJwt, validate(leaveRequestSchema), leaveRequest);

export default router;
