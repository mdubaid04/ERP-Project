import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "../db/prisma";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary";
import { comparePassword } from "../utils/comparePassword";

// Get Employee

const getEmployeeProfile = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.user;
  const employee = await prisma.employee.findUnique({
    where: {
      empId: empId,
    },
    omit: {
      password: true,
      otp: true,
      otpExpiry: true,
      refreshToken: true,
    },
  });
  if (!employee) {
    throw new ApiError(404, "Employee Not Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Employee Found Successfully", employee));
});

// Update Employee Profile Itself

const updateProfileItself = asyncHandler(
  async (req: Request, res: Response) => {
    const { empId } = req.user;
    const { firstName, lastName, address, city, state, pinCode } = req.body;
    interface UpdateDetails {
      firstName?: string;
      lastName?: string;
      address?: string;
      city?: string;
      state?: string;
      pinCode?: string;
    }
    let updateDetails: UpdateDetails = {};
    if (firstName) {
      updateDetails["firstName"] = firstName;
    }
    if (lastName) {
      updateDetails["lastName"] = lastName;
    }
    if (address) {
      updateDetails["address"] = address;
    }
    if (city) {
      updateDetails["city"] = city;
    }
    if (state) {
      updateDetails["state"] = state;
    }
    if (pinCode) {
      updateDetails["pinCode"] = pinCode;
    }
    if (Object.keys(updateDetails).length === 0) {
      throw new ApiError(400, "No fields to update");
    }
    const updatedEmployee = await prisma.employee.update({
      where: {
        empId: empId,
      },
      data: { ...updateDetails },
      omit: {
        password: true,
        otp: true,
        otpExpiry: true,
        refreshToken: true,
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Employee Updated Successfully", updatedEmployee)
      );
  }
);

// updateProfile

const updateProfilePic = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.user;
  const existingEmployee = await prisma.employee.findUnique({
    where: {
      empId: empId,
    },
  });
  if (!existingEmployee) {
    throw new ApiError(404, "Employee Not Found");
  }
  const localProfilePicPath = req.file?.path;
  if (!localProfilePicPath) {
    throw new ApiError(404, "Profile Pic Not Found");
  }
  const cloudinaryPath = await uploadOnCloudinary(localProfilePicPath!);
  if (!cloudinaryPath) {
    throw new ApiError(500, "Cloudinary Error");
  }
  const profilePic = cloudinaryPath?.secure_url!;
  const updatedEmployee = await prisma.employee.update({
    where: {
      empId: empId,
    },
    data: {
      profilePic: profilePic,
    },
  });
  if (existingEmployee?.profilePic) {
    const result = await deleteFromCloudinary(
      existingEmployee.profilePicPublicId!
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Employee Updated Successfully",
        updatedEmployee.profilePic
      )
    );
});

// updatePassword

const updatePassword = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.user;
  const { oldPassword, newPassword } = req.body;
  const existingEmployee = await prisma.employee.findUnique({
    where: {
      empId: empId,
    },
  });
  if (!existingEmployee) {
    throw new ApiError(404, "Employee Not Found");
  }
  const passwordMatch = await comparePassword(
    oldPassword,
    existingEmployee.password
  );
  if (!passwordMatch) {
    throw new ApiError(400, "Old Password is Incorrect");
  }
  const updatedEmployee = await prisma.employee.update({
    where: {
      empId: empId,
    },
    data: {
      password: newPassword,
    },
    omit: {
      password: true,
      otp: true,
      otpExpiry: true,
      refreshToken: true,
    },
  });
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Employee Updated Successfully", updatedEmployee)
    );
});

// UpdateDetails through Admin by Request

const createUpdateRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const { empId } = req.user;
    const { fieldName, newValue } = req.body;
    const existingEmployee = await prisma.employee.findUnique({
      where: {
        empId: empId,
      },
    });
    if (!existingEmployee) {
      throw new ApiError(404, "Employee Not Found");
    }
    const existingRequest = await prisma.updateRequest.findFirst({
      where: {
        empId: empId,
        fieldName: fieldName,
        status: "PENDING",
      },
    });
    if (existingRequest) {
      throw new ApiError(
        400,
        "A pending request for this field already exists"
      );
    }
    const oldValue =
      fieldName === "Email" ? existingEmployee.email : existingEmployee.phoneNo;
    const updateRequest = await prisma.updateRequest.create({
      data: {
        empId: empId,
        fieldName: fieldName,
        oldValue: oldValue,
        newValue: newValue,
        status: "PENDING",
      },
    });
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "Update Request Submitted Successfully",
          updateRequest
        )
      );
  }
);

// Leave Request

const leaveRequest = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.user;
  const { startDate, endDate, reason, leaveType } = req.body;
  const employee = await prisma.employee.findUnique({
    where: {
      empId: empId,
    },
  });
  if (!employee) {
    throw new ApiError(404, "Employee Not Found");
  }
  const existingLeaveRequest = await prisma.leave.findFirst({
    where: {
      empId: empId,
      status: "PENDING",
      OR: [
        {
          startDate: {
            lte: endDate,
          },
          endDate: {
            gte: startDate,
          },
        },
      ],
    },
  });
  if (existingLeaveRequest) {
    throw new ApiError(400, "A pending leave request already exists");
  }
  const leaveRequest = await prisma.leave.create({
    data: {
      empId: empId,
      startDate: startDate,
      endDate: endDate,
      reason: reason,
      leaveType: leaveType,
      status: "PENDING",
    },
  });
  return res
    .status(201)
    .json(
      new ApiResponse(201, "Leave Request Submitted Successfully", leaveRequest)
    );
});

// get my leaves

const getMyLeaves = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.user;
  const leaves = await prisma.leave.findMany({
    where: {
      empId: empId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  //if no leaves found found many will return empty array
  return res
    .status(200)
    .json(new ApiResponse(200, "Leaves Fetched Successfully", leaves));
});

// cancel leave request

const cancelLeaveRequest = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.user;
  const { leaveId } = req.params;
  const leaveRequest = await prisma.leave.findUnique({
    where: {
      leaveId: Number(leaveId),
    },
  });
  if (!leaveRequest) {
    throw new ApiError(404, "Leave Request Not Found");
  }
  if (leaveRequest.status !== "PENDING") {
    throw new ApiError(400, "Only pending leave requests can be cancelled");
  }
  if (leaveRequest.empId !== empId) {
    throw new ApiError(403, "You are not authorized to cancel this leave");
  }
  await prisma.leave.delete({
    where: {
      leaveId: Number(leaveId),
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Leave Request Cancelled Successfully", {}));
});

// get myUpdateRequests

const getMyUpdateRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const { empId } = req.user;
    const updateRequests = await prisma.updateRequest.findMany({
      where: {
        empId: empId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Update Requests Fetched Successfully",
          updateRequests
        )
      );
  }
);

// get my tasks

const getMyTasks = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.user;
  const tasks = await prisma.task.findMany({
    where: {
      assignedToId: empId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (tasks.length === 0) {
    return res.status(200).json(new ApiResponse(200, "No Tasks Found", []));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Tasks Fetched Successfully", tasks));
});

//get task by Id

const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.user;
  const { taskId } = req.params;
  const task = await prisma.task.findUnique({
    where: {
      taskId: Number(taskId),
    },
  });
  if (!task) {
    throw new ApiError(404, "Task Not Found");
  }
  if (task.assignedToId !== empId) {
    throw new ApiError(403, "You are not authorized to view this task");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Task Fetched Successfully", task));
});

// Update Task Status

const updateTaskStatus = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.user;
  const { taskId } = req.params;
  const { status } = req.body;
  const task = await prisma.task.findUnique({
    where: {
      taskId: Number(taskId),
    },
  });
  if (!task) {
    throw new ApiError(404, "Task Not Found");
  }
  if (task.assignedToId !== empId) {
    throw new ApiError(403, "You are not authorized to update this task");
  }
  const updatedTask = await prisma.task.update({
    where: {
      taskId: Number(taskId),
    },
    data: {
      status: status,
    },
  });
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Task Status Updated Successfully", updatedTask)
    );
});

// get payroll by Id
const getPayrollById = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.user;
  const { payrollId } = req.params;
  const payroll = await prisma.payroll.findUnique({
    where: {
      payrollId: Number(payrollId),
    },
  });
  if (!payroll) {
    throw new ApiError(404, "Payroll Not Found");
  }
  if (payroll.empId !== empId) {
    throw new ApiError(403, "You are not authorized to view this payroll");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Payroll Fetched Successfully", payroll));
});

// get all payrolls of employee
const getAllPayrolls = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.user;
  const pageNo = Math.max(1, Number(req.query.pageNo) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (pageNo - 1) * limit;
  const sortOrderQuery = req.query.sortOrder as string;
  const sortOrder: "asc" | "desc" = sortOrderQuery === "desc" ? "desc" : "asc";
  const [payrolls, totalCount] = await prisma.$transaction([
    prisma.payroll.findMany({
      where: {
        empId: empId,
      },
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: sortOrder,
      },
    }),
    prisma.payroll.count(),
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

// get my all attendances

const getMyAttendances = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.user;
  const pageNo = Math.max(1, Number(req.query.pageNo) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (pageNo - 1) * limit;
  const sortOrderQuery = req.query.sortOrder as string;
  const sortOrder: "asc" | "desc" = sortOrderQuery === "desc" ? "desc" : "asc";
  const [attendances, totalCount] = await prisma.$transaction([
    prisma.attendance.findMany({
      where: {
        empId: empId,
      },
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: sortOrder,
      },
    }),
    prisma.attendance.count(),
  ]);
  return res.status(200).json(
    new ApiResponse(200, "Attendances Fetched Successfully", {
      attendances,
      pagination: {
        currentPage: pageNo,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
      },
    })
  );
});

// get my attendance by Id

const getMyAttendanceById = asyncHandler(
  async (req: Request, res: Response) => {
    const { empId } = req.user;
    const { attendanceId } = req.params;
    const attendance = await prisma.attendance.findUnique({
      where: {
        attendanceId: Number(attendanceId),
      },
    });
    if (!attendance) {
      throw new ApiError(404, "Attendance Not Found");
    }
    if (attendance.empId !== empId) {
      throw new ApiError(403, "You are not authorized to view this attendance");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Attendance Fetched Successfully", attendance)
      );
  }
);

// create attendance

const markAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.user;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const existingAttendance = await prisma.attendance.findFirst({
    where: {
      empId: empId,
      date: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });
  if (existingAttendance) {
    throw new ApiError(409, "Attendance for this date already exists");
  }
  const now = new Date();
  const cutOffTime = new Date();
  cutOffTime.setHours(10, 30, 0, 0);
  const status = now > cutOffTime ? "LATE" : "PRESENT";
  const attendance = await prisma.attendance.create({
    data: {
      empId: empId,
      date: now,
      checkIn: now,
      status: status,
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Attendance Created Successfully", attendance));
});

// mark checkout

const markCheckout = asyncHandler(async (req: Request, res: Response) => {
  const { empId } = req.user;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const existingAttendance = await prisma.attendance.findFirst({
    where: {
      empId: empId,
      date: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });
  if (!existingAttendance) {
    throw new ApiError(404, "Attendance for this date does not exist");
  }
  if (existingAttendance.checkOut) {
    throw new ApiError(409, "Checkout for this date already marked");
  }
  const checkOut = new Date();
  const halfDayCutOffTime = new Date();
  halfDayCutOffTime.setHours(14, 0, 0, 0);
  const finalStatus =
    checkOut < halfDayCutOffTime ? "HALF_DAY" : existingAttendance.status;
  const updatedAttendance = await prisma.attendance.update({
    where: {
      attendanceId: existingAttendance.attendanceId,
    },
    data: {
      checkOut: checkOut,
      status: finalStatus,
    },
  });
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Attendance Updated Successfully", updatedAttendance)
    );
});

// create Qualification
const createQualification = asyncHandler(
  async (req: Request, res: Response) => {
    const { empId } = req.user;
    const { degree, university, passingYear, grade } = req.body;
    const employee = await prisma.employee.findUnique({
      where: {
        empId: empId,
      },
    });
    if (!employee) {
      throw new ApiError(404, "Employee Not Found");
    }
    const qualification = await prisma.qualification.create({
      data: {
        degree: degree,
        university: university,
        passingYear: passingYear,
        grade: grade,
        empId: employee.empId,
      },
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Qualification Created Successfully",
          qualification
        )
      );
  }
);

// update Qualification
const updateQualification = asyncHandler(
  async (req: Request, res: Response) => {
    const { empId } = req.user;
    const { qualId } = req.params;
    const { degree, university, passingYear, grade } = req.body;

    const qualification = await prisma.qualification.findUnique({
      where: {
        qualId: Number(qualId),
      },
    });

    if (!qualification) {
      throw new ApiError(404, "Qualification Not Found");
    }
    interface UpdateDetails {
      degree?: string;
      university?: string;
      passingYear?: number;
      grade?: string;
    }
    let updateDetails: UpdateDetails = {};
    if (degree) updateDetails["degree"] = degree;
    if (university) updateDetails["university"] = university;
    if (passingYear) updateDetails["passingYear"] = passingYear;
    if (grade) updateDetails["grade"] = grade;

    if (Object.keys(updateDetails).length === 0) {
      throw new ApiError(400, "No fields to update");
    }
    const employee = await prisma.employee.findUnique({
      where: {
        empId: empId,
      },
    });
    if (employee?.empId !== qualification.empId) {
      throw new ApiError(
        404,
        "You are not authorized to update this qualification"
      );
    }
    const qualificationDetail = await prisma.qualification.update({
      where: {
        qualId: qualification.qualId,
      },
      data: { ...updateDetails },
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Qualification Updated Successfully",
          qualificationDetail
        )
      );
  }
);

// get all qualifications of employee
const getAllQualifications = asyncHandler(
  async (req: Request, res: Response) => {
    const { empId } = req.user;
    const qualifications = await prisma.qualification.findMany({
      where: {
        empId: empId,
      },
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Qualifications Fetched Successfully",
          qualifications
        )
      );
  }
);
//delete qualification
const deleteQualification = asyncHandler(
  async (req: Request, res: Response) => {
    const { empId } = req.user;
    const { qualId } = req.params;
    const qualification = await prisma.qualification.findUnique({
      where: {
        qualId: Number(qualId),
      },
    });
    if (!qualification) {
      throw new ApiError(404, "Qualification Not Found");
    }
    if (empId !== qualification.empId) {
      throw new ApiError(
        404,
        "You are not authorized to delete this qualification"
      );
    }
    await prisma.qualification.delete({
      where: {
        qualId: qualification.qualId,
      },
    });
    return res
      .status(200)
      .json(new ApiResponse(200, "Qualification Deleted Successfully", {}));
  }
);

export {
  getEmployeeProfile,
  updateProfileItself,
  updateProfilePic,
  updatePassword,
  createUpdateRequest,
  leaveRequest,
  getMyLeaves,
  cancelLeaveRequest,
  getMyUpdateRequests,
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
};
