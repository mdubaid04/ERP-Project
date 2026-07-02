import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "../db/prisma";
import { sendPasswordEmail } from "../utils/mailer";
import temPass from "../utils/tempPassword";
import { SortOrder } from "../../generated/prisma/internal/prismaNamespace";

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
  });
  if (!department) {
    throw new ApiError(404, "Department Not Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Department fetched successfully", department));
});

export {
  registerEmployee,
  createDepartment,
  updateDepartment,
  getAllDepartments,
  getDepartmentById,
};
