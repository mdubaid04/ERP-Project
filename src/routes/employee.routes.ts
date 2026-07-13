import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import {
  getEmployeeProfile,
  updateProfileItself,
  updateProfilePic,
  updatePassword,
  createUpdateRequest,
  leaveRequest,
  getMyLeaves,
  cancelLeaveRequest,
  getMyUpdateRequests,
  getUpdateRequestById,
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
  getPayrollHistory,
  getPayrollHistoryById,
  getLeaveById,
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
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.route("/").get(verifyJwt, getEmployeeProfile);

router
  .route("/update-details")
  .patch(verifyJwt, validate(updateSchema), updateProfileItself);

router
  .route("/update-profile-pic")
  .patch(verifyJwt, upload.single("profilePic"), updateProfilePic);

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

router.route("/leave/:leaveId").get(verifyJwt, getLeaveById);
router
  .route("/cancel-leave-request/:leaveId")
  .post(verifyJwt, cancelLeaveRequest);

router.route("/update-requests").get(verifyJwt, getMyUpdateRequests);

router
  .route("/update-request/:updateRequestId")
  .get(verifyJwt, getUpdateRequestById);

router.route("/tasks").get(verifyJwt, getMyTasks);

router.route("/task/:taskId").get(verifyJwt, getTaskById);

router
  .route("/update-task-status/:taskId")
  .patch(verifyJwt, validate(updateTaskStatusSchema), updateTaskStatus);

router.route("/payroll/:payrollId").get(verifyJwt, getPayrollById);

router.route("/payrolls").get(verifyJwt, getAllPayrolls);

router.route("/attendances").get(verifyJwt, getMyAttendances);

router.route("/attendance/:attendanceId").get(verifyJwt, getMyAttendanceById);

router.route("/mark-attendance").post(verifyJwt, markAttendance);

router.route("/mark-checkout").post(verifyJwt, markCheckout);

router
  .route("/create-qualification")
  .post(
    verifyJwt,
    validate(createQualificationSchema),
    upload.single("certificate"),
    createQualification
  );
router.route("/qualifications").get(verifyJwt, getAllQualifications);
router
  .route("/update-qualification/:qualId")
  .patch(verifyJwt, validate(updateQualificationSchema), updateQualification);
router.route("/qualifications").get(verifyJwt, getAllQualifications);
router
  .route("/delete-qualification/:qualId")
  .delete(verifyJwt, deleteQualification);

router.route("/payrolls-history").get(verifyJwt, getPayrollHistory);
router
  .route("/payroll-history/:payrollId")
  .get(verifyJwt, getPayrollHistoryById);
export default router;
