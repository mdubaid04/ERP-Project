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
import { authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

router
  .route("/")
  .get(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    getEmployeeProfile
  );

router
  .route("/update-details")
  .patch(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    validate(updateSchema),
    updateProfileItself
  );

router
  .route("/update-profile-pic")
  .patch(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    upload.single("profilePic"),
    updateProfilePic
  );

router
  .route("/update-password")
  .patch(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    validate(updatePasswordSchema),
    updatePassword
  );

router
  .route("/create-update-request")
  .post(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    validate(createUpdateRequestSchema),
    createUpdateRequest
  );

router
  .route("/leave-request")
  .post(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    validate(leaveRequestSchema),
    leaveRequest
  );

router
  .route("/leaves")
  .get(verifyJwt, authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"), getMyLeaves);

router
  .route("/leave/:leaveId")
  .get(verifyJwt, authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"), getLeaveById);
router
  .route("/cancel-leave-request/:leaveId")
  .post(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    cancelLeaveRequest
  );

router
  .route("/update-requests")
  .get(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    getMyUpdateRequests
  );

router
  .route("/update-request/:updateRequestId")
  .get(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    getUpdateRequestById
  );

router
  .route("/tasks")
  .get(authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"), getMyTasks);

router
  .route("/task/:taskId")
  .get(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    verifyJwt,
    getTaskById
  );

router
  .route("/update-task-status/:taskId")
  .patch(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    validate(updateTaskStatusSchema),
    updateTaskStatus
  );

router
  .route("/payroll/:payrollId")
  .get(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    getPayrollById
  );

router
  .route("/payrolls")
  .get(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    getAllPayrolls
  );

router
  .route("/attendances")
  .get(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    getMyAttendances
  );

router
  .route("/attendance/:attendanceId")
  .get(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    getMyAttendanceById
  );

router
  .route("/mark-attendance")
  .post(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    markAttendance
  );

router
  .route("/mark-checkout")
  .post(verifyJwt, authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"), markCheckout);

router
  .route("/create-qualification")
  .post(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    validate(createQualificationSchema),
    upload.single("certificate"),
    createQualification
  );
router
  .route("/qualifications")
  .get(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    getAllQualifications
  );
router
  .route("/update-qualification/:qualId")
  .patch(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    validate(updateQualificationSchema),
    updateQualification
  );
router
  .route("/qualifications")
  .get(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    getAllQualifications
  );
router
  .route("/delete-qualification/:qualId")
  .delete(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    deleteQualification
  );

router
  .route("/payrolls-history")
  .get(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    getPayrollHistory
  );
router
  .route("/payroll-history/:payrollId")
  .get(
    verifyJwt,
    authorizeRole("MANAGER", "ADMIN", "EMPLOYEE"),
    getPayrollHistoryById
  );
export default router;
