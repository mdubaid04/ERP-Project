import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "../db/prisma";
import { comparePassword } from "../utils/comparePassword";
import { generatedOtp } from "../utils/otpGeneration";
import { sendOtpEmail, sendResetPasswordOtpEmail } from "../utils/mailer";
import tempToken from "../utils/temp_token_for_OTP";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/token";

// Login Controller

const loginEmployee = asyncHandler(async (req: Request, res: Response) => {
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

    return res
      .status(200)
      .cookie("tempToken", temporaryToken, option)
      .json(new ApiResponse(200, "OTP Send To Registered Email", {}));
  } catch (error) {
    console.error("Login Error :", error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal Server Error", {}));
  }
});

// OTP Verification

const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
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
    if (updatedEmployee.role === "ADMIN") {
      const profile = {
        empId: updatedEmployee.empId,
        firstName: updatedEmployee.firstName,
        lastName: updatedEmployee.lastName,
        email: updatedEmployee.email,
        role: updatedEmployee.role,
      };
      return res
        .status(200)
        .cookie("accessToken", accessToken, accessOption)
        .cookie("refreshToken", refreshToken, refreshOption)
        .clearCookie("tempToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .json(new ApiResponse(200, "OTP Verified Successfully", profile));
    }
    return res
      .status(200)
      .cookie("accessToken", accessToken, accessOption)
      .cookie("refreshToken", refreshToken, refreshOption)
      .json(new ApiResponse(200, "OTP Verified Successfully", updatedEmployee));
  } catch (error) {
    console.error("OTP Verification Error :", error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal Server Error", {}));
  }
});

// logOut Controller

const logout = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "User Not Logged In");
  }
  console.log("------req.user------", req.user.empId);
  prisma.employee.update({
    where: {
      empId: req.user.empId,
    },
    data: {
      refreshToken: null,
    },
  });
  const cookieOption = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOption)
    .clearCookie("refreshToken", cookieOption)
    .clearCookie("tempToken", cookieOption)
    .json(new ApiResponse(200, "Logout Successfully", {}));
});

// refreshAccess Token Controller
const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new ApiError(404, "Refresh Token Not Found");
  }
  const employee = await prisma.employee.findUnique({
    where: {
      empId: req.user.empId,
    },
  });
  if (!employee) {
    throw new ApiError(404, "Employee Not Found");
  }

  if (employee?.refreshToken !== refreshToken) {
    throw new ApiError(401, "Refresh Token Not Valid Or Expired");
  }
  const newAccessToken = generateAccessToken(
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
  return res
    .status(200)
    .cookie("accessToken", newAccessToken, accessOption)
    .json(new ApiResponse(200, "Access Token Refreshed Successfully", {}));
});

// Forgot Password

const forgetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, phoneNo } = req.body;
  const exsistingEmployee = await prisma.employee.findFirst({
    where: {
      OR: [
        {
          email: email,
        },
        {
          phoneNo: phoneNo,
        },
      ],
    },
  });
  if (!exsistingEmployee) {
    throw new ApiError(404, "Employee not found");
  }
  const otp = generatedOtp();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  await prisma.employee.update({
    where: {
      email: email,
    },
    data: {
      otp: otp,
      otpExpiry: otpExpiry,
    },
  });
  await sendResetPasswordOtpEmail(email, otp);
  const token = tempToken(email);
  const option = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 5 * 60 * 1000,
  };
  return res
    .cookie("tempToken", token, option)
    .status(200)
    .json(new ApiResponse(200, "OTP Sent Successfully", {}));
});

// Reset Password
const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  interface Jwtpayload {
    email: string;
  }
  const { tempToken } = req.cookies;
  const { otp, newPassword } = req.body;
  if (!tempToken) {
    throw new ApiError(404, "Session Expired ");
  }
  const decoded = jwt.verify(
    tempToken,
    process.env.TEMP_JWT_ACCESS_SECRET!
  ) as Jwtpayload;
  if (!decoded) {
    throw new ApiError(401, "UnAuthorized Or Invalid Token");
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
  if (newPassword === employee.password) {
    throw new ApiError(400, "New Password can't be same as old password");
  }
  await prisma.employee.update({
    where: {
      email: decoded.email,
    },
    data: {
      password: newPassword,
      otp: null,
      otpExpiry: null,
    },
  });
  const option = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  return res
    .clearCookie("tempToken", option)
    .status(200)
    .json(new ApiResponse(200, "Password Reset Successfully", {}));
});

// Export

export {
  loginEmployee,
  verifyOTP,
  logout,
  refreshAccessToken,
  forgetPassword,
  resetPassword,
};
