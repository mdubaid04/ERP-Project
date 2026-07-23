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
