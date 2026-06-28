import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { asyncHanldler } from "../utils/asyncHandler";
import { prisma } from "../db/prisma";
import { Role } from "../../generated/prisma/enums";

interface jwtPayload {
  id: number;
  name: string;
  email: string;
  role: Role;
}

const veriyJwt = asyncHanldler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies.accessToken ||
      req.header("Authrization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(404, "Token not found");
    }
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string
      ) as jwtPayload;
      if (!decoded) {
        throw new ApiError(401, "Token not valid");
      }
      const employee = await prisma.employee.findUnique({
        where: {
          empId: decoded.id,
        },
        select: {
          empId: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      });
      if (!employee) {
        throw new ApiError(404, "Employee not found");
      }
      req.user = employee;
      next();
    } catch (error) {
      console.log("Error in auth middleware", error);
    }
  }
);

// role check middleware
const authorizeRole = async (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Access Denied");
    }
    next();
  };
};

export { veriyJwt, authorizeRole };
