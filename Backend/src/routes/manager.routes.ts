import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import { authorizeRole } from "../middlewares/auth.middleware";
import {
  //?shared Controllers
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

  //?Manager Specific Controllers
  getAllEmployeesOfDept,
  getEmployeeByEmpId,
  createTaskForDeptEmployees,
  getAllTasksOfDept,
  getTaskByEmpId,
  getTaskByTaskId,
  getDeptAttendanceOverview,
  getAttendanceByEmpId,
  getDeptLeaves,
  getLeaveOverviewByEmpId,
} from "../controllers/manager.controllers";
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

router.route("/").get(authorizeRole("MANAGER"), verifyJwt, getEmployeeProfile);

router
  .route("/update-details")
  .patch(
    authorizeRole("MANAGER"),
    verifyJwt,
    validate(updateSchema),
    updateProfileItself
  );

router
  .route("/update-profile-pic")
  .patch(
    authorizeRole("MANAGER"),
    verifyJwt,
    upload.single("profilePic"),
    updateProfilePic
  );

router
  .route("/update-password")
  .patch(
    authorizeRole("MANAGER"),
    verifyJwt,
    validate(updatePasswordSchema),
    updatePassword
  );

router
  .route("/create-update-request")
  .post(
    authorizeRole("MANAGER"),
    verifyJwt,
    validate(createUpdateRequestSchema),
    createUpdateRequest
  );

router
  .route("/leave-request")
  .post(
    authorizeRole("MANAGER"),
    verifyJwt,
    validate(leaveRequestSchema),
    leaveRequest
  );

router.route("/leaves").get(authorizeRole("MANAGER"), verifyJwt, getMyLeaves);

router
  .route("/leave/:leaveId")
  .get(authorizeRole("MANAGER"), verifyJwt, getLeaveById);
router
  .route("/cancel-leave-request/:leaveId")
  .post(authorizeRole("MANAGER"), verifyJwt, cancelLeaveRequest);

router
  .route("/update-requests")
  .get(authorizeRole("MANAGER"), verifyJwt, getMyUpdateRequests);

router
  .route("/update-request/:updateRequestId")
  .get(authorizeRole("MANAGER"), verifyJwt, getUpdateRequestById);

router.route("/tasks").get(authorizeRole("MANAGER"), verifyJwt, getMyTasks);

router
  .route("/task/:taskId")
  .get(authorizeRole("MANAGER"), verifyJwt, getTaskById);

router
  .route("/update-task-status/:taskId")
  .patch(
    authorizeRole("MANAGER"),
    verifyJwt,
    validate(updateTaskStatusSchema),
    updateTaskStatus
  );

router
  .route("/payroll/:payrollId")
  .get(authorizeRole("MANAGER"), verifyJwt, getPayrollById);

router
  .route("/payrolls")
  .get(authorizeRole("MANAGER"), verifyJwt, getAllPayrolls);

router
  .route("/attendances")
  .get(authorizeRole("MANAGER"), verifyJwt, getMyAttendances);

router
  .route("/attendance/:attendanceId")
  .get(authorizeRole("MANAGER"), verifyJwt, getMyAttendanceById);

router
  .route("/mark-attendance")
  .post(authorizeRole("MANAGER"), verifyJwt, markAttendance);

router
  .route("/mark-checkout")
  .post(authorizeRole("MANAGER"), verifyJwt, markCheckout);

router
  .route("/create-qualification")
  .post(
    authorizeRole("MANAGER"),
    verifyJwt,
    validate(createQualificationSchema),
    upload.single("certificate"),
    createQualification
  );
router
  .route("/qualifications")
  .get(authorizeRole("MANAGER"), verifyJwt, getAllQualifications);
router
  .route("/update-qualification/:qualId")
  .patch(
    authorizeRole("MANAGER"),
    verifyJwt,
    validate(updateQualificationSchema),
    updateQualification
  );
router
  .route("/qualifications")
  .get(authorizeRole("MANAGER"), verifyJwt, getAllQualifications);
router
  .route("/delete-qualification/:qualId")
  .delete(authorizeRole("MANAGER"), verifyJwt, deleteQualification);

router
  .route("/payrolls-history")
  .get(authorizeRole("MANAGER"), verifyJwt, getPayrollHistory);
router
  .route("/payroll-history/:payrollId")
  .get(authorizeRole("MANAGER"), verifyJwt, getPayrollHistoryById);

//? MANAGER Specific Routes

router
  .route("/employees")
  .get(authorizeRole("MANAGER"), verifyJwt, getAllEmployeesOfDept);

router
  .route("/employee/:empId")
  .get(authorizeRole("MANAGER"), verifyJwt, getEmployeeByEmpId);

router
  .route("/create-task")
  .post(authorizeRole("MANAGER"), verifyJwt, createTaskForDeptEmployees);

router
  .route("/tasks")
  .get(authorizeRole("MANAGER"), verifyJwt, getAllTasksOfDept);

router
  .route("/task/:empId")
  .get(authorizeRole("MANAGER"), verifyJwt, getTaskByEmpId);

router
  .route("/task/:taskId")
  .get(authorizeRole("MANAGER"), verifyJwt, getTaskByTaskId);

router
  .route("/attendances")
  .get(authorizeRole("MANAGER"), verifyJwt, getDeptAttendanceOverview);

router
  .route("/attendance/:empId")
  .get(authorizeRole("MANAGER"), verifyJwt, getAttendanceByEmpId);

router.route("/leaves").get(authorizeRole("MANAGER"), verifyJwt, getDeptLeaves);

router
  .route("/leave/:empId")
  .get(authorizeRole("MANAGER"), verifyJwt, getLeaveOverviewByEmpId);

export default router;
