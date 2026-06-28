import { asyncHanldler } from "../utils/asyncHandler";
import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import type { Employee } from "../../generated/prisma/client";
import { prisma } from "../db/prisma";
import { comparePassword } from "../utils/comparePassword";
import { generatedOtp } from "../utils/otpGeneration";
import { sendOtpEmail } from "../utils/mailer";
import tempToken from "../utils/temp_token_for_OTP";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/token";

// Register Employee

const registerEmployee = asyncHanldler(async (req: Request, res: Response) => {
  console.log(req.body);
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
  const employee = await prisma.employee.create({
    data: { ...req.body, joiningDate: new Date(), isActive: true },
  });
  return res
    .status(201)
    .json(new ApiResponse(201, "Employee registered successfully", employee));
});

export { registerEmployee };
