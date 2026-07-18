import { prisma } from "../db/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import type { Request, Response } from "express";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary";
import { comparePassword } from "../utils/comparePassword";
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
import {
  AttendanceStatus,
  RequestStatus,
  TaskStatus,
} from "../../generated/prisma/enums";

// getAllEmployeesOfDepartment

const getAllEmployeesOfDept = asyncHandler(
  async (req: Request, res: Response) => {
    const { empId } = req.user;
    const { deptId } = req.params;
    if (isNaN(Number(deptId))) {
      throw new ApiError(400, "Invalid Department Id");
    }
    const pageNo = Math.max(1, Number(req.query.pageNo) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (pageNo - 1) * limit;
    const sortOrderQuery = req.query.sortOrder as string;
    const sortOrder: "asc" | "desc" =
      sortOrderQuery === "desc" ? "desc" : "asc";
    const isActiveQuery = req.query.isActive as string;
    const isActive = isActiveQuery === "true" ? true : false;

    const manager = await prisma.employee.findUnique({
      where: {
        empId: empId,
      },
    });
    if (!manager) {
      throw new ApiError(404, "Manager not found");
    }
    if (manager.role !== "MANAGER") {
      throw new ApiError(403, "You are not authorized to perform this action");
    }
    if (manager.departmentId !== Number(deptId)) {
      throw new ApiError(403, "You are not authorized to perform this action");
    }
    const [employees, totalCount] = await prisma.$transaction([
      prisma.employee.findMany({
        where: {
          departmentId: Number(deptId),
          isActive: isActive,
        },
        select: {
          empId: true,
          firstName: true,
          lastName: true,
          role: true,
          phoneNo: true,
          email: true,
          isActive: true,
        },
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: sortOrder,
        },
      }),
      prisma.employee.count({
        where: {
          departmentId: Number(deptId),
          isActive: true,
        },
      }),
    ]);
    return res.status(200).json(
      new ApiResponse(200, "Employees found successfully", {
        employees,
        pagination: {
          currentPage: pageNo,
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
        },
      })
    );
  }
);

// getEmployeeOfDeptById

const getEmployeeByEmpId = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.params;
  if (isNaN(Number(empId))) {
    throw new ApiError(400, "Invalid Employee Id");
  }
  const manager = await prisma.employee.findUnique({
    where: {
      empId: req.user.empId,
    },
  });
  if (!manager) {
    throw new ApiError(404, "Manager not found");
  }
  if (manager.role !== "MANAGER") {
    throw new ApiError(403, "You are not authorized to perform this action");
  }

  const employee = await prisma.employee.findUnique({
    where: {
      empId: Number(empId),
    },
    include: {
      department: {
        select: {
          deptId: true,
          name: true,
          manager: {
            select: {
              empId: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
      },
      qualification: {
        select: {
          degree: true,
          university: true,
          passingYear: true,
          grade: true,
        },
      },
    },
  });
  if (!employee) {
    throw new ApiError(404, "Employee Not Found");
  }
  if (manager.departmentId !== employee?.departmentId) {
    throw new ApiError(403, "You are not authorized to view this employee");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Employee found successfully", employee));
});

// createTaskForDeptEmployees

const createTaskForDeptEmployees = asyncHandler(
  async (req: Request, res: Response) => {
    const { taskName, description, dueDate, assignedToId } = req.body;
    const manager = await prisma.employee.findUnique({
      where: {
        empId: req.user.empId,
      },
    });
    if (!manager) {
      throw new ApiError(404, "Manager Not Found");
    }
    if (manager.role !== "MANAGER") {
      throw new ApiError(400, "Task can only be created for Manager");
    }
    const employee = await prisma.employee.findUnique({
      where: {
        empId: assignedToId,
      },
    });
    if (!employee) {
      throw new ApiError(404, "Employee Not Found");
    }
    const existingTask = await prisma.task.findFirst({
      where: {
        taskName,
        assignedToId,
        status: { not: "COMPLETED" },
        dueDate: dueDate,
      },
    });
    if (existingTask) {
      throw new ApiError(
        400,
        "This Task is already assigned to this employee with same due date"
      );
    }
    if (manager.departmentId !== employee.departmentId) {
      throw new ApiError(
        403,
        "You are not authorized to create task for this employee"
      );
    }
    const task = await prisma.task.create({
      data: {
        taskName,
        description,
        issueDate: new Date(),
        dueDate,
        assignedToId,
        assignedById: req.user.empId,
      },
    });
    return res
      .status(200)
      .json(new ApiResponse(200, "Task created successfully", task));
  }
);

//getAllTasksOfDept

const getAllTasksOfDept = asyncHandler(async (req: Request, res: Response) => {
  const { deptId } = req.params;
  if (isNaN(Number(deptId))) {
    throw new ApiError(400, "Invalid Department Id");
  }
  const manager = await prisma.employee.findUnique({
    where: {
      empId: req.user.empId,
    },
  });
  if (!manager) {
    throw new ApiError(404, "Manager not found");
  }
  if (manager.role !== "MANAGER") {
    throw new ApiError(403, "You are not authorized to perform this action");
  }
  const deptEmployees = await prisma.employee.findMany({
    where: {
      departmentId: Number(deptId),
    },
    select: {
      empId: true,
    },
  });
  if (manager.departmentId !== Number(deptId)) {
    throw new ApiError(
      403,
      "You are not authorized to view tasks of this department"
    );
  }
  const tasks = await prisma.task.findMany({
    where: {
      assignedToId: {
        in: deptEmployees.map((emp) => emp.empId),
      },
    },
    include: {
      assignedBy: {
        select: {
          empId: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      },
      assignedTo: {
        select: {
          empId: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      },
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Tasks found successfully", tasks));
});

//getTaskByEmpId

const getTaskByEmpId = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.params;
  const empIdNum = Number(empId);
  if (isNaN(empIdNum)) {
    throw new ApiError(400, "Invalid Employee Id");
  }
  const manager = await prisma.employee.findUnique({
    where: {
      empId: req.user.empId,
    },
  });
  if (!manager) {
    throw new ApiError(404, "Manager not found");
  }
  const pageNo = Math.max(1, Number(req.query.pageNo) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (pageNo - 1) * limit;
  const taskStatusQuery = req.query.status as TaskStatus | undefined;
  const validStatuses = ["IN_PROGRESS", "COMPLETED", "PENDING"];
  if (taskStatusQuery && !validStatuses.includes(taskStatusQuery)) {
    throw new ApiError(400, "Invalid Status");
  }
  const status = taskStatusQuery;

  const sortOrderQuery = req.query.sortOrder as string;
  const sortOrder: "asc" | "desc" = sortOrderQuery === "desc" ? "desc" : "asc";
  const employee = await prisma.employee.findUnique({
    where: {
      empId: empIdNum,
    },
  });
  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }
  if (manager.departmentId !== employee.departmentId) {
    throw new ApiError(
      403,
      "You are not authorized to view tasks of this employee"
    );
  }
  const [taskStatuses, totalCount] = await prisma.$transaction([
    prisma.task.findMany({
      where: {
        assignedToId: empIdNum,
        ...(status && { status: status }),
      },
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: sortOrder,
      },
      include: {
        assignedTo: {
          select: {
            empId: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        assignedBy: {
          select: {
            empId: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    }),
    prisma.task.count({
      where: {
        assignedToId: empIdNum,
        ...(status && { status: status }),
      },
    }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      `All ${status} Task Fetched of ${empId} Successfully`,
      {
        taskStatuses,
        pagination: {
          currentPage: pageNo,
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
        },
      }
    )
  );
});

//getTaskByTaskId

const getTaskByTaskId = asyncHandler(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const taskIdNum = Number(taskId);
  if (isNaN(taskIdNum)) {
    throw new ApiError(400, "Invalid Task Id");
  }
  const manager = await prisma.employee.findUnique({
    where: {
      empId: req.user.empId,
    },
  });
  if (!manager) {
    throw new ApiError(404, "Manager not found");
  }

  const task = await prisma.task.findUnique({
    where: {
      taskId: taskIdNum,
    },
  });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  if (manager.empId !== task.assignedById) {
    throw new ApiError(403, "You are not authorized to view this task");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Task found successfully", task));
});

//getDeptAttendanceOverview

const getDeptAttendanceOverview = asyncHandler(
  async (req: Request, res: Response) => {
    const { deptId } = req.params;
    if (isNaN(Number(deptId))) {
      throw new ApiError(400, "Invalid Department Id");
    }
    const pageNo = Math.max(1, Number(req.query.pageNo) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (pageNo - 1) * limit;
    const attendanceStatusQuery = req.query.status as
      | AttendanceStatus
      | undefined;
    const validStatuses = ["PRESENT", "ABSENT", "HALF_DAY", "ON_LEAVE", "LATE"];
    if (
      attendanceStatusQuery &&
      !validStatuses.includes(attendanceStatusQuery)
    ) {
      throw new ApiError(400, "Invalid Status");
    }
    const status = attendanceStatusQuery;
    const attendanceDateQuery = req.query.date as string | undefined;
    let attendanceDate: Date | undefined;
    if (attendanceDateQuery) {
      attendanceDate = new Date(attendanceDateQuery);
      if (isNaN(attendanceDate.getTime())) {
        throw new ApiError(400, "Invalid Date");
      }
    }
    const manager = await prisma.employee.findUnique({
      where: {
        empId: req.user.empId,
      },
    });
    if (!manager) {
      throw new ApiError(404, "Manager not found");
    }
    const department = await prisma.department.findUnique({
      where: {
        deptId: Number(deptId),
      },
    });
    if (!department) {
      throw new ApiError(404, "Department not found");
    }
    if (manager.departmentId !== Number(deptId)) {
      throw new ApiError(403, "You are not authorized to view this department");
    }
    const employees = await prisma.employee.findMany({
      where: {
        departmentId: Number(deptId),
      },
    });
    const employeeIds = employees.map((emp) => emp.empId);
    const [employeeAttendances, TotalCount] = await prisma.$transaction([
      prisma.attendance.findMany({
        where: {
          empId: {
            in: employeeIds,
          },
          ...(status && { status: status }),
          ...(attendanceDate && { date: attendanceDate }),
        },
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          status: true,
          date: true,
          checkIn: true,
          checkOut: true,
          employee: {
            select: {
              empId: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
      }),
      prisma.attendance.count({
        where: {
          empId: {
            in: employeeIds,
          },
          ...(status && { status: status }),
          ...(attendanceDate && { date: attendanceDate }),
        },
      }),
    ]);
    return res.status(200).json(
      new ApiResponse(200, "Attendance fetched successfully", {
        employeeAttendances,
        Pagination: {
          currentPage: pageNo,
          totalPages: Math.ceil(TotalCount / limit),
          totalItems: TotalCount,
        },
      })
    );
  }
);

// getDeptAttendanceByEmpId

const getAttendanceByEmpId = asyncHandler(
  async (req: Request, res: Response) => {
    const { employeeId } = req.params;

    if (isNaN(Number(employeeId))) {
      throw new ApiError(400, "Invalid Employee Id");
    }

    const existingEmployee = await prisma.employee.findUnique({
      where: {
        empId: Number(employeeId),
      },
    });
    if (!existingEmployee) {
      throw new ApiError(404, "Employee Not Found");
    }

    const { empId } = req.user;
    const pageNo = Math.max(1, Number(req.query.pageNo) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (pageNo - 1) * limit;
    const attendanceStatusQuery = req.query.status as
      | AttendanceStatus
      | undefined;

    const validStatuses = ["PRESENT", "ABSENT", "HALF_DAY", "ON_LEAVE", "LATE"];
    if (
      attendanceStatusQuery &&
      !validStatuses.includes(attendanceStatusQuery)
    ) {
      throw new ApiError(400, "Invalid Status");
    }

    const status = attendanceStatusQuery;

    const attendanceDateQuery = req.query.date as string | undefined;

    let attendanceDate: Date | undefined;

    if (attendanceDateQuery) {
      attendanceDate = new Date(attendanceDateQuery);
      if (isNaN(attendanceDate.getTime())) {
        throw new ApiError(400, "Invalid Date");
      }
    }
    const manager = await prisma.employee.findUnique({
      where: {
        empId: empId,
      },
    });
    if (!manager) {
      throw new ApiError(404, "Manager not found");
    }
    if (manager.role !== "MANAGER") {
      throw new ApiError(403, "You are not authorized to perform this action");
    }
    if (manager.departmentId !== existingEmployee.departmentId) {
      throw new ApiError(403, "You are not authorized to perform this action");
    }
    const [employeeAttendances, TotalCount] = await prisma.$transaction([
      prisma.attendance.findMany({
        where: {
          empId: Number(employeeId),
          ...(status && { status: status }),
          ...(attendanceDate && { date: attendanceDate }),
        },
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          status: true,
          date: true,
          checkIn: true,
          checkOut: true,
          employee: {
            select: {
              empId: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
      }),
      prisma.attendance.count({
        where: {
          empId: Number(employeeId),
          ...(status && { status: status }),
          ...(attendanceDate && { date: attendanceDate }),
        },
      }),
    ]);
    return res.status(200).json(
      new ApiResponse(200, "Attendance fetched successfully", {
        employeeAttendances,
        Pagination: {
          currentPage: pageNo,
          totalPages: Math.ceil(TotalCount / limit),
          totalItems: TotalCount,
        },
      })
    );
  }
);

// getDeptLeaves

const getDeptLeaves = asyncHandler(async (req: Request, res: Response) => {
  const { deptId } = req.params;
  if (isNaN(Number(deptId))) {
    throw new ApiError(400, "Invalid Department Id");
  }
  const manager = await prisma.employee.findUnique({
    where: {
      empId: req.user.empId,
    },
    select: {
      empId: true,
      departmentId: true,
      role: true,
    },
  });
  if (!manager) {
    throw new ApiError(404, "Manager not found");
  }
  if (manager.role !== "MANAGER") {
    throw new ApiError(403, "You are not authorized to perform this action");
  }
  if (manager.departmentId !== Number(deptId)) {
    throw new ApiError(403, "You are not authorized to perform this action");
  }
  const deptEmployees = await prisma.employee.findMany({
    where: {
      departmentId: Number(deptId),
      isActive: true,
    },
    select: {
      empId: true,
    },
  });
  const pageNo = Math.max(1, Number(req.query.pageNo) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (pageNo - 1) * limit;
  const statusQuery = req.query.status as RequestStatus | undefined;
  const validStatuses = ["PENDING", "APPROVED", "REJECTED"];
  if (statusQuery && !validStatuses.includes(statusQuery)) {
    throw new ApiError(400, "Invalid Status");
  }
  const status = statusQuery as "PENDING" | "APPROVED" | "REJECTED" | undefined;
  const sortOrderQuery = req.query.sortOrder as string;
  const sortOrder: "asc" | "desc" = sortOrderQuery === "desc" ? "desc" : "asc";

  const leaveStartDateQuery = req.query.startDate as string | undefined;
  const leaveEndDateQuery = req.query.endDate as string | undefined;
  let leaveStartDate: Date | undefined;
  let leaveEndDate: Date | undefined;
  const dateFilter: {
    gte?: Date;
    lte?: Date;
  } = {};
  if (leaveStartDateQuery) {
    leaveStartDate = new Date(leaveStartDateQuery);
    if (isNaN(leaveStartDate.getTime())) {
      throw new ApiError(400, "Invalid Start Date");
    }
  }
  if (leaveEndDateQuery) {
    leaveEndDate = new Date(leaveEndDateQuery);
    if (isNaN(leaveEndDate.getTime())) {
      throw new ApiError(400, "Invalid End Date");
    }
  }
  if (leaveStartDate) {
    dateFilter.gte = leaveStartDate;
  }
  if (leaveEndDate) {
    dateFilter.lte = leaveEndDate;
  }

  const [allLeaveRequests, totalCount] = await prisma.$transaction([
    prisma.leave.findMany({
      where: {
        empId: {
          in: deptEmployees.map((emp) => emp.empId),
        },
        ...(status && { status: status }), // based on rule of && operator if left side is truthy then the expression become right side i.e, "PENDING"&&{status:"PENDING"} as left side is truthy then the expression become {status:"PENDING"} and after spread operator it become status:"PENDING"
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
      },
      include: {
        employee: {
          select: {
            empId: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        reviewer: {
          select: {
            empId: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: sortOrder,
      },
    }),
    prisma.leave.count({
      where: {
        empId: {
          in: deptEmployees.map((emp) => emp.empId),
        },
        ...(status && { status: status }),
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
      },
    }),
  ]);
  return res.status(200).json(
    new ApiResponse(200, "Leave Requests Fetched Successfully", {
      leaveRequests: allLeaveRequests,
      pagination: {
        currentPage: pageNo,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
      },
    })
  );
});

// getLeaveOverviewByEmpId

const getLeaveOverviewByEmpId = async (req: Request, res: Response) => {
  const { employeeId } = req.params;
  if (isNaN(Number(employeeId))) {
    throw new ApiError(400, "Invalid Department Id");
  }
  const existingEmployee = await prisma.employee.findUnique({
    where: {
      empId: Number(employeeId),
    },
    select: {
      empId: true,
      departmentId: true,
    },
  });
  if (!existingEmployee) {
    throw new ApiError(404, "Employee not found");
  }

  const manager = await prisma.employee.findUnique({
    where: {
      empId: req.user.empId,
    },
    select: {
      empId: true,
      departmentId: true,
      role: true,
    },
  });
  if (!manager) {
    throw new ApiError(404, "Manager not found");
  }
  if (manager.role !== "MANAGER") {
    throw new ApiError(403, "You are not authorized to perform this action");
  }
  if (manager.departmentId !== existingEmployee.departmentId) {
    throw new ApiError(403, "You are not authorized to perform this action");
  }
  const pageNo = Math.max(1, Number(req.query.pageNo) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (pageNo - 1) * limit;
  const statusQuery = req.query.status as RequestStatus | undefined;
  const validStatuses = ["PENDING", "APPROVED", "REJECTED"];
  if (statusQuery && !validStatuses.includes(statusQuery)) {
    throw new ApiError(400, "Invalid Status");
  }
  const status = statusQuery as "PENDING" | "APPROVED" | "REJECTED" | undefined;
  const sortOrderQuery = req.query.sortOrder as string;
  const sortOrder: "asc" | "desc" = sortOrderQuery === "desc" ? "desc" : "asc";

  const leaveStartDateQuery = req.query.startDate as string | undefined;
  const leaveEndDateQuery = req.query.endDate as string | undefined;
  let leaveStartDate: Date | undefined;
  let leaveEndDate: Date | undefined;
  const dateFilter: {
    gte?: Date;
    lte?: Date;
  } = {};
  if (leaveStartDateQuery) {
    leaveStartDate = new Date(leaveStartDateQuery);
    if (isNaN(leaveStartDate.getTime())) {
      throw new ApiError(400, "Invalid Start Date");
    }
  }
  if (leaveEndDateQuery) {
    leaveEndDate = new Date(leaveEndDateQuery);
    if (isNaN(leaveEndDate.getTime())) {
      throw new ApiError(400, "Invalid End Date");
    }
  }
  if (leaveStartDate) {
    dateFilter.gte = leaveStartDate;
  }
  if (leaveEndDate) {
    dateFilter.lte = leaveEndDate;
  }

  const [allLeaveRequests, totalCount] = await prisma.$transaction([
    prisma.leave.findMany({
      where: {
        empId: Number(employeeId),
        ...(status && { status: status }), // based on rule of && operator if left side is truthy then the expression become right side i.e, "PENDING"&&{status:"PENDING"} as left side is truthy then the expression become {status:"PENDING"} and after spread operator it become status:"PENDING"
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
      },
      include: {
        employee: {
          select: {
            empId: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        reviewer: {
          select: {
            empId: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: sortOrder,
      },
    }),
    prisma.leave.count({
      where: {
        empId: Number(employeeId),
        ...(status && { status: status }),
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
      },
    }),
  ]);
  return res.status(200).json(
    new ApiResponse(200, "Leave Requests Fetched Successfully", {
      leaveRequests: allLeaveRequests,
      pagination: {
        currentPage: pageNo,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
      },
    })
  );
};

export {
  //? Shared Countrollers
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

  //? Manager Specific Controllers
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
};
