import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "../db/prisma";
import {
  sendEmail,
  sendLeaveResponseMail,
  sendPasswordEmail,
} from "../utils/mailer";
import temPass from "../utils/tempPassword";
import type {
  Role,
  RequestStatus,
  TaskStatus,
  AttendanceStatus,
  PayrollStatus,
} from "../../generated/prisma/enums";
import { calculateTotalDays } from "../utils/calculateTotalDays";
import { getDatesInRange } from "../utils/getDatesInRange";
import calculateTotalWorkingdays from "../utils/calculateTotalWorkingdays";
import { th } from "zod/locales";

//?                                           EMPLOYEES CONTROLLER

// Register Employee

const registerEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, phoneNo, gender, role, dateOfBirth } =
    req.body;
  const exsistingEmployee = await prisma.employee.findFirst({
    where: {
      OR: [
        {
          email: req.body.email,
        },
        {
          phoneNo: req.body.phoneNo,
        },
      ],
    },
  });
  if (exsistingEmployee) {
    throw new ApiError(400, "Employee already exists");
  }
  const tempPassword = temPass(8);
  console.log(tempPassword);
  await sendPasswordEmail(email, tempPassword);
  const employee = await prisma.employee.create({
    data: {
      firstName,
      lastName,
      email,
      phoneNo,
      password: tempPassword,
      gender,
      role,
      dateOfBirth,
      joiningDate: new Date(),
      isActive: true,
    },
  });
  return res
    .status(201)
    .json(new ApiResponse(201, "Employee registered successfully", employee));
});

//get All Employees

const getAllEmployees = asyncHandler(async (req: Request, res: Response) => {
  const pageNo = Math.max(1, Number(req.query.pageNo) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (pageNo - 1) * limit;
  const sortOrderQuery = req.query.sortOrder as string;
  const sortOrder: "asc" | "desc" = sortOrderQuery === "desc" ? "desc" : "asc";

  const [employees, totalCount] = await prisma.$transaction([
    prisma.employee.findMany({
      where: {
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
});

// get employee by id

const getEmployeeById = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.params;
  if (isNaN(Number(empId))) {
    throw new ApiError(400, "Invalid Employee Id");
  }
  const employee = await prisma.employee.findUnique({
    where: {
      empId: Number(empId),
    },
  });
  if (!employee) {
    throw new ApiError(404, "Employee Not Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Employee found successfully", employee));
});

// get employee by department

const getEmployeeByDeptId = asyncHandler(
  async (req: Request, res: Response) => {
    const { deptId } = req.params;
    const pageNo = Math.max(1, Number(req.query.pageNo) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (pageNo - 1) * limit;
    const sortOrderQuery = req.query.sortOrder as string;
    const sortOrder: "asc" | "desc" =
      sortOrderQuery === "desc" ? "desc" : "asc";
    const [employees, totalCount] = await prisma.$transaction([
      prisma.employee.findMany({
        where: {
          departmentId: Number(deptId),
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

// get employee by role

const getEmployeeByRole = asyncHandler(async (req: Request, res: Response) => {
  const role = req.query.role as Role;
  const pageNo = Math.max(1, Number(req.query.pageNo) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (pageNo - 1) * limit;
  const sortOrderQuery = req.query.sortOrder as string;
  const sortOrder: "asc" | "desc" = sortOrderQuery === "desc" ? "desc" : "asc";
  const [employees, totalCount] = await prisma.$transaction([
    prisma.employee.findMany({
      where: {
        role: role,
      },
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: sortOrder,
      },
    }),
    prisma.employee.count({
      where: {
        role: role,
      },
    }),
  ]);

  return res.status(200).json(
    new ApiResponse(200, "Employees found", {
      employees,
      pagination: {
        currentPage: pageNo,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
      },
    })
  );
});

// get UnActiive Employee

const getUnActiveEmployee = asyncHandler(
  async (req: Request, res: Response) => {
    const pageNo = Math.max(1, Number(req.query.pageNo) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (pageNo - 1) * limit;
    const sortOrderQuery = req.query.sortOrder as string;
    const sortOrder: "asc" | "desc" =
      sortOrderQuery === "desc" ? "desc" : "asc";
    const [employees, totalCount] = await prisma.$transaction([
      prisma.employee.findMany({
        where: {
          isActive: false,
        },
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: sortOrder,
        },
      }),
      prisma.employee.count({
        where: {
          isActive: false,
        },
      }),
    ]);

    return res.status(200).json(
      new ApiResponse(200, "Employees found", {
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

// deactivate Employee

const deactivateEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.params;
  if (isNaN(Number(empId))) {
    throw new ApiError(400, "Invalid Employee Id");
  }
  const employee = await prisma.employee.update({
    where: {
      empId: Number(empId),
    },
    data: {
      isActive: false,
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Employee inActive successfully", employee));
});

// activate Employee

const activateEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.params;
  if (isNaN(Number(empId))) {
    throw new ApiError(400, "Invalid Employee Id");
  }
  const employee = await prisma.employee.update({
    where: {
      empId: Number(empId),
    },
    data: {
      isActive: true,
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Employee Active successfully", employee));
});

// promote Employee

const promoteEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.params;
  const { role } = req.body as { role: Role };
  if (isNaN(Number(empId))) {
    throw new ApiError(400, "Invalid Employee Id");
  }
  const roleHierarchy = {
    EMPLOYEE: 1,
    MANAGER: 2,
    TEAM_LEADER: 3,
    ADMIN: 4,
  };
  const existingEmployee = await prisma.employee.findUnique({
    where: {
      empId: Number(empId),
    },
  });
  if (!existingEmployee) {
    throw new ApiError(404, "Employee Not Found");
  }
  if (roleHierarchy[role] <= roleHierarchy[existingEmployee.role]) {
    throw new ApiError(400, "Ner Rule Must Be Higher than Current Role");
  }

  const employee = await prisma.employee.update({
    where: {
      empId: Number(empId),
    },
    data: {
      role: role,
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Employee Promoted successfully", employee));
});

//?                                                               DEPARTMENT CONTROLLERS

// Create Department

const createDepartment = asyncHandler(async (req: Request, res: Response) => {
  const { name, managerId } = req.body;
  const exsistingDepartment = await prisma.department.findFirst({
    where: {
      name: name,
    },
  });
  if (exsistingDepartment) {
    throw new ApiError(400, "Department already exists");
  }
  const department = await prisma.department.create({
    data: { name, managerId },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Department created successfully", department));
});

// Update Department

const updateDepartment = asyncHandler(async (req: Request, res: Response) => {
  const { deptId } = req.params;
  const { name, managerId } = req.body;
  interface UpdateDetail {
    name?: string;
    managerId?: number;
  }
  let updateDetail: UpdateDetail = {};
  if (managerId) {
    const managerExists = await prisma.employee.findUnique({
      where: {
        empId: managerId,
      },
    });
    if (!managerExists) {
      throw new ApiError(404, "Manager Not Found");
    }
    updateDetail["managerId"] = managerId;
  }
  if (name) {
    updateDetail["name"] = name;
  }
  if (Object.keys(updateDetail).length === 0) {
    throw new ApiError(400, "No fields to update");
  }
  const existingDepartment = await prisma.department.findUnique({
    where: {
      deptId: Number(deptId),
    },
  });
  if (!existingDepartment) {
    throw new ApiError(404, "Department Not Found");
  }
  const updatedDepartment = await prisma.department.update({
    where: {
      deptId: Number(deptId),
    },
    data: {
      ...updateDetail,
    },
  });
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Department updated successfully", updatedDepartment)
    );
});

// get all departments

const getAllDepartments = asyncHandler(async (req: Request, res: Response) => {
  const pageNo = Math.max(1, Number(req.query.pageNo) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (pageNo - 1) * limit;
  const sortOrderQuery = req.query.sortOrder as string;
  const sortOrder: "asc" | "desc" = sortOrderQuery === "desc" ? "desc" : "asc";
  const [departments, totalCounts] = await prisma.$transaction([
    prisma.department.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        deptId: sortOrder,
      },
      include: {
        manager: {
          select: {
            empId: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        employees: {
          select: {
            empId: true,
            firstName: true,
            lastName: true,
            role: true,
            phoneNo: true,
            email: true,
          },
        },
      },
    }),
    prisma.department.count(),
  ]);
  return res.status(200).json(
    new ApiResponse(200, "Departments fetched successfully", {
      departments,
      pagination: {
        currentPage: pageNo,
        totalPages: Math.ceil(totalCounts / limit),
        totalItems: totalCounts,
      },
    })
  );
});

// get department by id

const getDepartmentById = asyncHandler(async (req: Request, res: Response) => {
  const { deptId } = req.params;
  const deptIdNum = Number(deptId);
  if (isNaN(deptIdNum)) {
    throw new ApiError(400, "Invalid Department ID");
  }
  const department = await prisma.department.findUnique({
    where: {
      deptId: deptIdNum,
    },
    include: {
      manager: {
        select: {
          empId: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      },
      employees: {
        select: {
          empId: true,
          firstName: true,
          lastName: true,
          role: true,
          phoneNo: true,
          email: true,
        },
      },
    },
  });
  if (!department) {
    throw new ApiError(404, "Department Not Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Department fetched successfully", department));
});

//?                                                               UPDATE REQUEST CONTROLLERS

// get all update requests

const getAllUpdateRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const pageNo = Math.max(1, Number(req.query.pageNo) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (pageNo - 1) * limit;
    const statusQuery = req.query.status as RequestStatus | undefined;
    const validStatuses = ["PENDING", "APPROVED", "REJECTED"];
    if (statusQuery && !validStatuses.includes(statusQuery)) {
      throw new ApiError(400, "Invalid Status");
    }
    const status = statusQuery as
      | "PENDING"
      | "APPROVED"
      | "REJECTED"
      | undefined;
    const sortOrderQuery = req.query.sortOrder as string;
    const sortOrder: "asc" | "desc" =
      sortOrderQuery === "desc" ? "desc" : "asc";
    const [allUpdateRequests, totalCount] = await prisma.$transaction([
      prisma.updateRequest.findMany({
        where: {
          ...(status && { status: status }),
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
        },
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: sortOrder,
        },
      }),
      prisma.updateRequest.count(),
    ]);
    return res.status(200).json(
      new ApiResponse(200, "Update Requests Fetched Successfully", {
        updateRequests: allUpdateRequests,
        pagination: {
          currentPage: pageNo,
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
        },
      })
    );
  }
);

// get UpdateRequestById

const getUpdateRequestById = asyncHandler(
  async (req: Request, res: Response) => {
    const { updateRequestId } = req.params;
    const updateRequestIdNum = Number(updateRequestId);
    if (isNaN(updateRequestIdNum)) {
      throw new ApiError(400, "Invalid Update Request ID");
    }
    const updateRequest = await prisma.updateRequest.findUnique({
      where: {
        requestId: updateRequestIdNum,
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
      },
    });
    if (!updateRequest) {
      throw new ApiError(404, "Update Request Not Found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Update Request Fetched Successfully",
          updateRequest
        )
      );
  }
);

// execute update request
const processUpdateRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const { empId } = req.user;
    const { action, rejectReason } = req.body;
    const { updateRequestId } = req.params;
    const updateRequest = await prisma.updateRequest.findUnique({
      where: {
        requestId: Number(updateRequestId),
      },
    });
    if (!updateRequest) {
      throw new ApiError(404, "Update Request Not Found");
    }
    if (updateRequest.status !== "PENDING") {
      throw new ApiError(400, "Update Request Already Processed");
    }
    if (action === "APPROVED") {
      await prisma.$transaction([
        prisma.employee.update({
          where: {
            empId: updateRequest.empId,
          },
          data: {
            [updateRequest.fieldName]: updateRequest.newValue,
          },
        }),
        prisma.updateRequest.update({
          where: {
            requestId: Number(updateRequestId),
          },
          data: {
            status: "APPROVED",
          },
        }),
      ]);
    } else if (action === "REJECTED") {
      await prisma.updateRequest.update({
        where: {
          requestId: Number(updateRequestId),
        },
        data: {
          status: "REJECTED",
          rejectReason: rejectReason,
          reviewedBy: empId,
          reviewerRole: "ADMIN",
          reviewedAt: new Date(),
        },
      });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, `Update Request ${action.toLowerCase()}`, {}));
  }
);

//?                                                               LEAVE REQUEST CONTROLLERS

// get all leaveRequests

const getAllLeaveRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const pageNo = Math.max(1, Number(req.query.pageNo) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (pageNo - 1) * limit;
    const statusQuery = req.query.status as RequestStatus | undefined;
    const validStatuses = ["PENDING", "APPROVED", "REJECTED"];
    if (statusQuery && !validStatuses.includes(statusQuery)) {
      throw new ApiError(400, "Invalid Status");
    }
    const status = statusQuery as
      | "PENDING"
      | "APPROVED"
      | "REJECTED"
      | undefined;
    const sortOrderQuery = req.query.sortOrder as string;
    const sortOrder: "asc" | "desc" =
      sortOrderQuery === "desc" ? "desc" : "asc";

    const [allLeaveRequests, totalCount] = await prisma.$transaction([
      prisma.leave.findMany({
        where: {
          ...(status && { status: status }), // based on rule of && operator if left side is truthy then the expression become right side i.e, "PENDING"&&{status:"PENDING"} as left side is truthy then the expression become {status:"PENDING"} and after spread operator it become status:"PENDING"
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
        },
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: sortOrder,
        },
      }),
      prisma.leave.count({
        where: {
          ...(status && { status: status }),
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
  }
);

// get leaveRequestById

const getLeaveRequestById = asyncHandler(
  async (req: Request, res: Response) => {
    const { leaveId } = req.params;
    const leaveIdNum = Number(leaveId);
    if (isNaN(leaveIdNum)) {
      throw new ApiError(400, "Invalid Leave Request ID");
    }
    const leaveRequest = await prisma.leave.findUnique({
      where: {
        leaveId: leaveIdNum,
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
      },
    });
    if (!leaveRequest) {
      throw new ApiError(404, "Leave Request Not Found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Leave Request Fetched Successfully", leaveRequest)
      );
  }
);

// Process Leave Request

const processLeaveRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const { leaveId } = req.params;
    const { action, rejectReason } = req.body;
    if (!["APPROVED", "REJECTED"].includes(action)) {
      throw new ApiError(400, "Invalid Action");
    }
    if (action === "REJECTED" && !rejectReason) {
      throw new ApiError(400, "Reject Reason Required");
    }
    const reviewerRemark = action === "REJECTED" ? rejectReason : "APPROVED";
    const leaveIdNum = Number(leaveId);
    if (isNaN(leaveIdNum)) {
      throw new ApiError(400, "Invalid Leave Request ID");
    }
    const leaveRequest = await prisma.leave.findUnique({
      where: {
        leaveId: leaveIdNum,
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            remainingLeaves: true,
          },
        },
      },
    });
    if (!leaveRequest) {
      throw new ApiError(404, "Leave Request Not Found");
    }
    if (leaveRequest.status !== "PENDING") {
      throw new ApiError(400, "Leave Request Already Processed");
    }
    await prisma.leave.update({
      where: {
        leaveId: leaveIdNum,
      },
      data: {
        status: action,
        reviewerRemarks: reviewerRemark,
        reviewedBy: req.user.empId,
        reviewerRole: "ADMIN",
        reviewedAt: new Date(),
      },
    });
    if (action === "APPROVED") {
      const dates = getDatesInRange(
        leaveRequest.startDate,
        leaveRequest.endDate
      );
      const totalDays = calculateTotalDays(
        leaveRequest.startDate,
        leaveRequest.endDate
      );
      const [, updatedEmployee] = await prisma.$transaction([
        prisma.attendance.createMany({
          data: dates.map((date) => ({
            empId: leaveRequest.empId,
            date: date,
            status: "ON_LEAVE",
          })),
          skipDuplicates: true,
        }),
        prisma.employee.update({
          where: {
            empId: leaveRequest.empId,
          },
          data: {
            remainingLeaves: {
              decrement: totalDays,
            },
          },
          select: {
            remainingLeaves: true,
          },
        }),
      ]);
      sendLeaveResponseMail(
        leaveRequest.employee.email,
        action,
        "",
        updatedEmployee.remainingLeaves
      );
    } else {
      sendLeaveResponseMail(
        leaveRequest.employee.email,
        action,
        rejectReason,
        leaveRequest.employee.remainingLeaves
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, `Leave Request ${action} `, {}));
  }
);

//?                                                               TASK CONTROLLERS

// get all Task Status

const getTasksByStatus = asyncHandler(async (req: Request, res: Response) => {
  const pageNo = Math.max(1, Number(req.query.pageNo) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (pageNo - 1) * limit;
  const taskStatusQuery = req.query.status as TaskStatus | undefined;
  const validStatuses = ["IN_PROGRESS", "COMPLETED", "PENDING"];
  if (taskStatusQuery && !validStatuses.includes(taskStatusQuery)) {
    throw new ApiError(400, "Invalid Status");
  }
  const status = taskStatusQuery as
    | "PENDING"
    | "IN_PROGRESS"
    | "COMPLETED"
    | undefined;
  const sortOrderQuery = req.query.sortOrder as string;
  const sortOrder: "asc" | "desc" = sortOrderQuery === "desc" ? "desc" : "asc";

  const [taskStatuses, totalCount] = await prisma.$transaction([
    prisma.task.findMany({
      where: {
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
        ...(status && { status: status }),
      },
    }),
  ]);

  return res.status(200).json(
    new ApiResponse(200, "Task Status Fetched Successfully", {
      taskStatuses,
      pagination: {
        currentPage: pageNo,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
      },
    })
  );
});

// get task by employee

const getTaskByEmpId = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.params;
  const empIdNum = Number(empId);
  if (isNaN(empIdNum)) {
    throw new ApiError(400, "Invalid Employee Id");
  }
  const pageNo = Math.max(1, Number(req.query.pageNo) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (pageNo - 1) * limit;
  const taskStatusQuery = req.query.status as TaskStatus | undefined;
  const validStatuses = ["IN_PROGRESS", "COMPLETED", "PENDING"];
  if (taskStatusQuery && !validStatuses.includes(taskStatusQuery)) {
    throw new ApiError(400, "Invalid Status");
  }
  const status = taskStatusQuery as
    | "PENDING"
    | "IN_PROGRESS"
    | "COMPLETED"
    | undefined;
  const sortOrderQuery = req.query.sortOrder as string;
  const sortOrder: "asc" | "desc" = sortOrderQuery === "desc" ? "desc" : "asc";
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

// get Task by role
const getTaskByRole = asyncHandler(async (req: Request, res: Response) => {
  const roleQuery = req.query.role as Role | undefined;
  const validRoles = ["ADMIN", "MANAGER", "EMPLOYEE", "TEAM_LEADER"];
  if (roleQuery && !validRoles.includes(roleQuery)) {
    throw new ApiError(400, "Invalid Role");
  }
  const role = roleQuery as
    | "ADMIN"
    | "MANAGER"
    | "EMPLOYEE"
    | "TEAM_LEADER"
    | undefined;
  const pageNo = Math.max(1, Number(req.query.pageNo) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (pageNo - 1) * limit;
  const taskStatusQuery = req.query.status as TaskStatus | undefined;
  const validStatuses = ["IN_PROGRESS", "COMPLETED", "PENDING"];
  if (taskStatusQuery && !validStatuses.includes(taskStatusQuery)) {
    throw new ApiError(400, "Invalid Status");
  }
  const status = taskStatusQuery as
    | "PENDING"
    | "IN_PROGRESS"
    | "COMPLETED"
    | undefined;
  const sortOrderQuery = req.query.sortOrder as string;
  const sortOrder: "asc" | "desc" = sortOrderQuery === "desc" ? "desc" : "asc";
  const [taskStatuses, totalCount] = await prisma.$transaction([
    prisma.task.findMany({
      where: {
        ...(status && { status: status }),
        ...(role && { assignedTo: { role: role } }),
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
        ...(status && { status: status }),
        ...(role && { assignedTo: { role: role } }),
      },
    }),
  ]);

  return res.status(200).json(
    new ApiResponse(200, `All ${status} Task Fetched of ${role} Successfully`, {
      taskStatuses,
      pagination: {
        currentPage: pageNo,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
      },
    })
  );
});

// create Task For Manager
const createTaskForManager = asyncHandler(
  async (req: Request, res: Response) => {
    const { taskName, description, dueDate, assignedToId } = req.body;
    const manager = await prisma.employee.findUnique({
      where: {
        empId: assignedToId,
      },
    });
    if (!manager) {
      throw new ApiError(404, "Manager Not Found");
    }
    if (manager.role !== "MANAGER") {
      throw new ApiError(400, "Task can only be created for Manager");
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
        "This Task is already assigned to this manager with same due date"
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

//?                                                               Attendance CONTROLLERS

// getAllAttendance
const getAllAttendance = asyncHandler(async (req: Request, res: Response) => {
  const pageNo = Math.max(1, Number(req.query.pageNo) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (pageNo - 1) * limit;
  const attendanceStatusQuery = req.query.status as
    | AttendanceStatus
    | undefined;
  const validStatuses = ["PRESENT", "ABSENT", "HALF_DAY", "ON_LEAVE", "LATE"];
  if (attendanceStatusQuery && !validStatuses.includes(attendanceStatusQuery)) {
    throw new ApiError(400, "Invalid Status");
  }
  const status = attendanceStatusQuery;
  const [attendance, totalCount] = await prisma.$transaction([
    prisma.attendance.findMany({
      where: {
        ...(status && { status: status }),
      },
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
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
      },
    }),
    prisma.attendance.count({
      where: {
        ...(status && { status: status }),
      },
    }),
  ]);
  return res.status(200).json(
    new ApiResponse(200, "All Attendance Fetched Successfully", {
      attendance,
      pagination: {
        currentPage: pageNo,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
      },
    })
  );
});

//get attendance by id
const getAttendanceById = asyncHandler(async (req: Request, res: Response) => {
  const { attendanceId } = req.params;
  if (isNaN(Number(attendanceId))) {
    throw new ApiError(400, "Invalid Attendance Id");
  }
  const attendance = await prisma.attendance.findUnique({
    where: {
      attendanceId: Number(attendanceId),
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
    },
  });
  if (!attendance) {
    throw new ApiError(404, "Attendance Not Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Attendance Fetched Successfully", attendance));
});

// update Attendance
const updateAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { attendanceId } = req.params;
  const { status, checkIn, checkOut } = req.body;
  if (!attendanceId || isNaN(Number(attendanceId))) {
    throw new ApiError(400, "Invalid Attendance Id");
  }
  if (status) {
    const validStatuses = ["PRESENT", "ABSENT", "HALF_DAY", "ON_LEAVE", "LATE"];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, "Invalid Status");
    }
  }
  if (checkIn && isNaN(Date.parse(checkIn))) {
    throw new ApiError(400, "Invalid checkIn");
  }
  if (checkOut && isNaN(Date.parse(checkOut))) {
    throw new ApiError(400, "Invalid checkOut");
  }

  if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
    throw new ApiError(400, "checkOut must be after checkIn");
  }

  const existingAttendance = await prisma.attendance.findUnique({
    where: {
      attendanceId: Number(attendanceId),
    },
  });
  if (!existingAttendance) {
    throw new ApiError(404, "Attendance Not Found");
  }

  const attendance = await prisma.attendance.update({
    where: {
      attendanceId: Number(attendanceId),
    },
    data: {
      ...(status && { status: status }),
      ...(checkIn && { checkIn: new Date(checkIn) }),
      ...(checkOut && { checkOut: new Date(checkOut) }),
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
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Attendance Updated Successfully", attendance));
});

//?                                                               PayRoll CONTROLLERS

// create Payroll

const createPayrollIndividual = asyncHandler(
  async (req: Request, res: Response) => {
    const { empId, month, year, basicSalary, allowance, bonus, deductions } =
      req.body;
    const existingEmployee = await prisma.employee.findUnique({
      where: {
        empId: empId,
      },
    });
    if (!existingEmployee) {
      throw new ApiError(404, "Employee Not Found");
    }
    const existingPayroll = await prisma.payroll.findUnique({
      where: {
        empId_month_year: {
          empId: empId,
          month: month,
          year: year,
        },
      },
    });
    if (existingPayroll) {
      throw new ApiError(
        400,
        "Payroll Already Exists for this employee in given month and year"
      );
    }
    const totalWorkingDaysOfMonth = await calculateTotalWorkingdays(
      year,
      month
    );
    const monthAttendance = await prisma.attendance.findMany({
      where: {
        empId: empId,
        date: {
          gte: new Date(year, month - 1, 1),
          lte: new Date(year, month, 0),
        },
      },
      select: {
        status: true,
        checkIn: true,
        checkOut: true,
        date: true,
      },
    });
    const monthLeaves = await prisma.leave.findMany({
      where: {
        empId: empId,
        startDate: {
          lte: new Date(year, month, 0),
        },
        endDate: {
          gte: new Date(year, month - 1, 1),
        },
      },
      select: {
        status: true,
        leaveType: true,
        startDate: true,
        endDate: true,
      },
    });
    let totalPresentDays = 0;
    for (let day of monthAttendance) {
      if (day.status == "PRESENT") {
        totalPresentDays++;
      } else if (day.status == "HALF_DAY") {
        totalPresentDays += 0.5;
      } else if (day.status == "LATE") {
        totalPresentDays += 0.75;
      } else if (day.status == "ON_LEAVE") {
        const matchingLeave = monthLeaves.find(
          (leave) =>
            leave.status == "APPROVED" &&
            (leave.leaveType == "SICK" || leave.leaveType == "CASUAL") &&
            day.date >= leave.startDate &&
            day.date <= leave.endDate
        );
        if (matchingLeave) {
          totalPresentDays++;
        }
      }
    }

    const perDaySalary = Number(basicSalary) / totalWorkingDaysOfMonth;
    const payableIncome =
      totalPresentDays * perDaySalary +
      Number(allowance || 0) +
      Number(bonus || 0) -
      Number(deductions || 0);
    const payroll = await prisma.payroll.create({
      data: {
        empId: empId,
        month: month,
        year: year,
        totalDays: totalWorkingDaysOfMonth,
        presentDays: totalPresentDays,
        basicSalary: basicSalary,
        allowance: allowance,
        bonus: bonus,
        deductions: deductions,
        netSalary: payableIncome,
        issueDate: new Date(),
        status: "PENDING",
        issuedById: req.user.empId,
        issuerRole: req.user.role,
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
      },
    });
    return res
      .status(200)
      .json(new ApiResponse(201, "Payroll Created Successfully", payroll));
  }
);

// update Payroll

const updatePayroll = asyncHandler(async (req: Request, res: Response) => {
  const { payrollId } = req.params;
  if (isNaN(Number(payrollId))) {
    throw new ApiError(400, "Invalid Payroll Id");
  }

  const existingPayroll = await prisma.payroll.findUnique({
    where: {
      payrollId: Number(payrollId),
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
    },
  });
  if (!existingPayroll) {
    throw new ApiError(404, "Payroll Not Found");
  }

  const { status } = req.body;
  const updatedPayroll = await prisma.payroll.update({
    where: {
      payrollId: Number(payrollId),
    },
    data: {
      status: status,
    },
  });
  const statusResponse: Record<string, string> = {
    FAILED:
      "Due to some issues with Bank . Your PayRoll status will updated shortly",
    HOLD: "Your Payroll has been put on hold by Admin , Please contact Admin for more information",
  };
  const reasonText = statusResponse[status] ? `${statusResponse[status]}` : "";
  try {
    sendEmail({
      To: existingPayroll.employee.email,
      Subject: `Payroll ${status}`,
      Text: `Your Payroll for ${updatedPayroll.month}/${updatedPayroll.year} has been ${status}.${reasonText} .`,
      Html: `<div style="font-family:Arial, Helvetica, sans-serif;max-width:480px;margin:auto;padding:24px; border : 1px solid #e0e0e0; border-radius:8px;">
      <h2 style="color:#333;">Payroll ${status}</h2>
      <p style="color:#555; font-size:14px;">Your Payroll for ${updatedPayroll.month}/${updatedPayroll.year} has been ${status}.${reasonText} .</p>
      <p style="color:#888; font-size:12px;">If you did't request this, you can ignore this email.</p>
      </div>`,
    });
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Payroll Updated Successfully", updatedPayroll));
});

// get Payrolls

const getPayrolls = asyncHandler(async (req: Request, res: Response) => {
  const pageNo = Math.max(1, Number(req.query.pageNo) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (pageNo - 1) * limit;
  const payrollStatusQuery = req.query.status as PayrollStatus | undefined;
  const validStatuses = ["PENDING", "PAID", "FAILED", "HOLD"];
  if (payrollStatusQuery && !validStatuses.includes(payrollStatusQuery)) {
    throw new ApiError(400, "Invalid Status");
  }
  const status = payrollStatusQuery;
  const sortOrderQuery = req.query.sortOrder as string;
  const sortOrder: "asc" | "desc" = sortOrderQuery === "desc" ? "desc" : "asc";
  const [payrolls, totalCount] = await prisma.$transaction([
    prisma.payroll.findMany({
      where: {
        ...(status && { status: status }),
      },
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: sortOrder,
      },
      include: {
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
    prisma.payroll.count({
      where: {
        ...(status && { status: status }),
      },
    }),
  ]);
  if (payrolls.length === 0) {
    return res.status(200).json(new ApiResponse(200, "No Payrolls Found", []));
  }
  return res.status(200).json(
    new ApiResponse(200, "Payrolls Fetched Successfully", {
      payrolls,
      pagination: {
        currentPage: pageNo,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
      },
    })
  );
});

// get Payroll By Id

const getPayrollById = asyncHandler(async (req: Request, res: Response) => {
  const { payrollId } = req.params;
  if (isNaN(Number(payrollId))) {
    throw new ApiError(400, "Invalid Payroll Id");
  }
  const payroll = await prisma.payroll.findUnique({
    where: {
      payrollId: Number(payrollId),
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
      issuedBy: {
        select: {
          empId: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
  if (!payroll) {
    throw new ApiError(404, "Payroll Not Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Payroll Fetched Successfully", payroll));
});

// get Payroll By empId

const getPayrollByEmpId = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.params;
  if (isNaN(Number(empId))) {
    throw new ApiError(400, "Invalid Employee Id");
  }
  const month = Number(req.query.month as string);
  if (isNaN(month)) {
    throw new ApiError(400, "Invalid Month . It should be between 1 to 12");
  }

  const year = Number(req.query.year as string);
  if (isNaN(year)) {
    throw new ApiError(400, "Invalid Year . It should be a 4 digit number");
  }
  const payroll = await prisma.payroll.findUnique({
    where: {
      empId_month_year: {
        empId: Number(empId),
        month: month,
        year: year,
      },
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
      issuedBy: {
        select: {
          empId: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
  if (!payroll) {
    throw new ApiError(404, "Payroll Not Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Payroll Fetched Successfully", payroll));
});

//?                                                                  Payroll History CONTROLLERS

// create Payroll History

const createPayrollHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const { empId } = req.user;
    const { employeeId, newSalary, reason } = req.body;
    const existingEmployee = await prisma.employee.findUnique({
      where: {
        empId: Number(employeeId),
      },
      include: {
        payroll: {
          select: {
            netSalary: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });
    if (!existingEmployee) {
      throw new ApiError(404, "Employee Not Found");
    }
    if (existingEmployee.payroll.length === 0) {
      throw new ApiError(
        404,
        "No existing payroll found for this employee to compare"
      );
    }
    const oldSalary = existingEmployee.payroll[0]!.netSalary;
    const payroll = await prisma.payrollHistory.create({
      data: {
        empId: Number(employeeId),
        oldSalary: oldSalary,
        newSalary: Number(newSalary),
        reason: reason,
        changeDate: new Date(),
        changedById: empId,
      },
    });
    return res
      .status(201)
      .json(
        new ApiResponse(200, "Payroll History Created Successfully", payroll)
      );
  }
);

// get Payroll History

const getPayrollHistory = asyncHandler(async (req: Request, res: Response) => {
  const pageNo = Math.max(1, Number(req.query.pageNo) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (pageNo - 1) * limit;
  const sortOrderQuery = req.query.sortOrder as string;
  const sortOrder: "asc" | "desc" = sortOrderQuery === "desc" ? "desc" : "asc";
  const [payrolls, totalCount] = await prisma.$transaction([
    prisma.payrollHistory.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: sortOrder,
      },
      include: {
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
    prisma.payrollHistory.count(),
  ]);
  if (payrolls.length === 0) {
    return res.status(200).json(new ApiResponse(200, "No Payrolls Found", []));
  }
  return res.status(200).json(
    new ApiResponse(200, "Payrolls Fetched Successfully", {
      payrolls,
      pagination: {
        currentPage: pageNo,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
      },
    })
  );
});

// get Payroll History By Id

const getPayrollHistoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const { payrollId } = req.params;
    if (isNaN(Number(payrollId))) {
      throw new ApiError(400, "Invalid Payroll Id");
    }
    const payroll = await prisma.payrollHistory.findUnique({
      where: {
        payrollHistoryId: Number(payrollId),
      },
      include: {
        employee: {
          select: {
            empId: true,
            firstName: true,
            email: true,
            lastName: true,
            role: true,
          },
        },
        changedBy: {
          select: {
            empId: true,
            firstName: true,
            email: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
    if (!payroll) {
      throw new ApiError(404, "Payroll Not Found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Payroll Fetched Successfully", payroll));
  }
);

// get Payroll History By empId

const getPayrollHistoryByEmpId = asyncHandler(
  async (req: Request, res: Response) => {
    const { empId } = req.params;
    if (isNaN(Number(empId))) {
      throw new ApiError(400, "Invalid Employee Id");
    }
    const payrollhistory = await prisma.payrollHistory.findMany({
      where: {
        empId: Number(empId),
      },
      include: {
        employee: {
          select: {
            empId: true,
            firstName: true,
            email: true,
            lastName: true,
            role: true,
          },
        },
        changedBy: {
          select: {
            empId: true,
            firstName: true,
            email: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
    if (payrollhistory.length === 0) {
      throw new ApiError(404, "Payroll Not Found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Payroll Fetched Successfully", payrollhistory)
      );
  }
);

export {
  registerEmployee,
  getAllEmployees,
  getEmployeeById,
  getEmployeeByDeptId,
  getEmployeeByRole,
  getUnActiveEmployee,
  promoteEmployee,
  deactivateEmployee,
  activateEmployee,
  getUpdateRequestById,
  createDepartment,
  updateDepartment,
  getAllDepartments,
  getDepartmentById,
  getAllUpdateRequests,
  processUpdateRequest,
  createTaskForManager,
  getTaskByRole,
  getTaskByEmpId,
  getTasksByStatus,
  processLeaveRequest,
  getLeaveRequestById,
  getAllLeaveRequests,
};
