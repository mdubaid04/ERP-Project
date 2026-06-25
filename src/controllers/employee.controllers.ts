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

// Login Controller

const loginEmployee = asyncHanldler(async (req: Request, res: Response) => {
  try {
    const employee = await prisma.employee.findFirst({
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
    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    if (!employee.isActive) {
      throw new ApiError(400, "Employee is not active");
    }
    const passwordMatch = await comparePassword(
      req.body.password,
      employee.password
    );

    if (!passwordMatch) {
      throw new ApiError(401, "Invalid password");
    }
    const otp = generatedOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await prisma.employee.update({
      where: {
        email: employee.email,
      },
      data: {
        otp: otp,
        otpExpiry: otpExpiry,
      },
    });
    await sendOtpEmail(employee.email, otp);
    const temporaryToken = tempToken(employee.email);
    console.log("------tempToken------", temporaryToken);
    const option = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 60 * 1000,
    };
    res.cookie("tempToken", temporaryToken, option);

    return res
      .status(200)
      .json(new ApiResponse(200, "OTP Send To Registered Email", {}));
  } catch (error) {
    console.error("Login Error :", error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal Server Error", {}));
  }
});

// OTP Verification

const verifyOTP = asyncHanldler(async (req: Request, res: Response) => {
  try {
    const token = req.cookies.tempToken;
    console.log("----token--------", token);
    const { otp } = req.body;
    if (!token) {
      throw new ApiError(404, "Session Expired Please Login Again");
    }
    const decoded = jwt.verify(
      token,
      process.env.TEMP_JWT_ACCESS_SECRET as string
    ) as { email: string };
    if (!decoded) {
      throw new ApiError(401, "Session Expired Please Login Again");
    }
    const employee = await prisma.employee.findUnique({
      where: {
        email: decoded.email,
      },
    });
    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }
    if (employee.otp !== otp) {
      throw new ApiError(400, "Invalid OTP");
    }
    if (employee.otpExpiry! < new Date()) {
      throw new ApiError(400, "OTP Expired");
    }

    const accessToken = generateAccessToken(
      employee.empId,
      employee.firstName,
      employee.lastName,
      employee.email,
      employee.role
    );
    const accessOption = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    };
    const refreshOption = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    const refreshToken = generateRefreshToken(employee.empId);
    res.cookie("accessToken", accessToken, accessOption);
    res.cookie("refreshToken", refreshToken, refreshOption);
    const updatedEmployee = await prisma.employee.update({
      where: {
        email: employee.email,
      },
      data: {
        otp: null,
        otpExpiry: null,
        refreshToken: refreshToken,
      },
      omit: {
        password: true,
        otp: true,
        otpExpiry: true,
      },
    });
    return res
      .status(200)
      .json(new ApiResponse(200, "OTP Verified Successfully", updatedEmployee));
  } catch (error) {
    console.error("OTP Verification Error :", error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal Server Error", {}));
  }
});

export { registerEmployee, loginEmployee, verifyOTP };
