import { asyncHanldler } from "../utils/asyncHandler";
import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "../db/prisma";
import { sendPasswordEmail } from "../utils/mailer";
import temPass from "../utils/tempPassword";

// Register Employee

const registerEmployee = asyncHanldler(async (req: Request, res: Response) => {
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

const createDepartment = asyncHanldler(async (req: Request, res: Response) => {
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

export { registerEmployee, createDepartment };
