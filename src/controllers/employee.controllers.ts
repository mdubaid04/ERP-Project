import { asyncHanldler } from "../utils/asyncHandler";
import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "../db/prisma";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary";
import { comparePassword } from "../utils/comparePassword";

// Get Employee

const getEmployee = asyncHanldler(async (req: Request, res: Response) => {
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

const updateProfileItself = asyncHanldler(
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

const updateProfilePic = asyncHanldler(async (req: Request, res: Response) => {
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

const updatePassword = asyncHanldler(async (req: Request, res: Response) => {
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

const createUpdateRequest = asyncHanldler(
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

const leaveRequest = asyncHanldler(async (req: Request, res: Response) => {
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

const getMyLeaves = asyncHanldler(async (req: Request, res: Response) => {
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

const cancelLeaveRequest = asyncHanldler(
  async (req: Request, res: Response) => {
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
  }
);

// get myUpdateRequests

const getMyUpdateRequests = asyncHanldler(
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

export {
  getEmployee,
  updateProfileItself,
  updateProfilePic,
  updatePassword,
  createUpdateRequest,
  leaveRequest,
  getMyLeaves,
  cancelLeaveRequest,
  getMyUpdateRequests,
};
