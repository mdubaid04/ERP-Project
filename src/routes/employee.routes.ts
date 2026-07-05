import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import {
  cancelLeaveRequest,
  createUpdateRequest,
  getEmployee,
  getMyLeaves,
  getMyUpdateRequests,
  leaveRequest,
  updateProfileItself,
  updateProfilePic,
  updatePassword,
  getMyTasks,
  getTaskById,
  updateTaskStatus,
  getPayrollById,
  getAllPayrolls,
  getMyAttendances,
  getMyAttendanceById,
  markAttendance,
  markCheckout,
  createQualification,
  updateQualification,
  getAllQualifications,
  deleteQualification,
} from "../controllers/employee.controllers";
import { verifyJwt } from "../middlewares/auth.middleware";
import {
  createQualificationSchema,
  createUpdateRequestSchema,
  leaveRequestSchema,
  updatePasswordSchema,
  updateQualificationSchema,
  updateSchema,
} from "../validators/employee.validator";
import { updateTaskStatusSchema } from "../validators/task.validator";

const router = Router();
router.route("/").get(verifyJwt, getEmployee);

router
  .route("/update-details")
  .patch(verifyJwt, validate(updateSchema), updateProfileItself);

router.route("/update-profile-pic").patch(verifyJwt, updateProfilePic);

router
  .route("/update-password")
  .patch(verifyJwt, validate(updatePasswordSchema), updatePassword);

router
  .route("/create-update-request")
  .post(verifyJwt, validate(createUpdateRequestSchema), createUpdateRequest);

router
  .route("/leave-request")
  .post(verifyJwt, validate(leaveRequestSchema), leaveRequest);

router.route("/leaves").get(verifyJwt, getMyLeaves);

router
  .route("/cancel-leave-request/:leaveId")
  .post(verifyJwt, cancelLeaveRequest);

router.route("/update-requests").get(verifyJwt, getMyUpdateRequests);

router.route("/tasks").get(verifyJwt, getMyTasks);

router.route("/tasks/:taskId").get(verifyJwt, getTaskById);

router
  .route("/update-task-status/:taskId")
  .post(verifyJwt, validate(updateTaskStatusSchema), updateTaskStatus);

router.route("/payroll/:payrollId").get(verifyJwt, getPayrollById);

router.route("/payrolls").get(verifyJwt, getAllPayrolls);

router.route("/attendances").get(verifyJwt, getMyAttendances);

router.route("/attendances/:attendanceId").get(verifyJwt, getMyAttendanceById);

router.route("/mark-attendance").post(verifyJwt, markAttendance);

router.route("/mark-checkout").post(verifyJwt, markCheckout);

router
  .route("/create-qualification")
  .post(verifyJwt, validate(createQualificationSchema), createQualification);
router
  .route("/update-qualifications")
  .get(verifyJwt, validate(updateQualificationSchema), updateQualification);
router.route("/qualifications").get(verifyJwt, getAllQualifications);
router
  .route("/delete-qualification/:qualId")
  .delete(verifyJwt, deleteQualification);
export default router;
