import type { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { start } from "node:repl";

const adminDashboard = asyncHandler(async (req: Request, res: Response) => {
  const totalEmployees = await prisma.employee.count();
  const departmentWiseEmployees = await prisma.department.findMany({
    select: {
      name: true,
      _count: {
        select: {
          employees: true,
        },
      },
    },
  });

  const totalDepartments = await prisma.department.count();

  const startofMonth = new Date();
  startofMonth.setDate(1);
  startofMonth.setHours(0, 0, 0, 0);
  const endofMonth = new Date(
    startofMonth.getFullYear(),
    startofMonth.getMonth() + 1,
    0
  );
  endofMonth.setHours(23, 59, 59, 999);

  const groupedLeaves = await prisma.leave.groupBy({
    by: ["status"],
    where: {
      createdAt: {
        gte: startofMonth,
        lte: endofMonth,
      },
    },
    _count: {
      status: true,
    },
  });
  const leaveStatus = {
    PENDING:
      groupedLeaves.find((leave) => leave.status === "PENDING")?._count
        .status || 0,
    APPROVED:
      groupedLeaves.find((leave) => leave.status === "APPROVED")?._count
        .status || 0,
    REJECTED:
      groupedLeaves.find((leave) => leave.status === "REJECTED")?._count
        .status || 0,
  };
  const totalLeaves =
    leaveStatus.PENDING + leaveStatus.APPROVED + leaveStatus.REJECTED;

  const groupedUpdateRequests = await prisma.updateRequest.groupBy({
    by: ["status"],
    where: {
      createdAt: {
        gte: startofMonth,
        lte: endofMonth,
      },
    },
    _count: {
      status: true,
    },
  });

  const updateRequestStatus = {
    PENDING:
      groupedUpdateRequests.find((request) => request.status === "PENDING")
        ?._count.status || 0,
    APPROVED:
      groupedUpdateRequests.find((request) => request.status === "APPROVED")
        ?._count.status || 0,
    REJECTED:
      groupedUpdateRequests.find((request) => request.status === "REJECTED")
        ?._count.status || 0,
  };
  const totalUpdateRequests =
    updateRequestStatus.PENDING +
    updateRequestStatus.APPROVED +
    updateRequestStatus.REJECTED;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const attendanceGrouped = await prisma.attendance.groupBy({
    by: ["status"],
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    _count: {
      status: true,
    },
  });
  const attendanceStatus = {
    PRESENT:
      attendanceGrouped.find((attendance) => attendance.status === "PRESENT")
        ?._count.status || 0,
    LATE:
      attendanceGrouped.find((attendance) => attendance.status === "LATE")
        ?._count.status || 0,
    ABSENT:
      attendanceGrouped.find((attendance) => attendance.status === "ABSENT")
        ?._count.status || 0,
    HALF_DAY:
      attendanceGrouped.find((attendance) => attendance.status === "HALF_DAY")
        ?._count.status || 0,
    ON_LEAVE:
      attendanceGrouped.find((attendance) => attendance.status === "ON_LEAVE")
        ?._count.status || 0,
  };
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const payrollGrouped = await prisma.payroll.groupBy({
    by: ["status"],
    where: {
      month: currentMonth,
      year: currentYear,
    },
    _count: {
      status: true,
    },
  });
  const payrollStatus = {
    PENDING:
      payrollGrouped.find((payroll) => payroll.status === "PENDING")?._count
        .status || 0,
    PAID:
      payrollGrouped.find((payroll) => payroll.status === "PAID")?._count
        .status || 0,
    FAILED:
      payrollGrouped.find((payroll) => payroll.status === "FAILED")?._count
        .status || 0,
    HOLD:
      payrollGrouped.find((payroll) => payroll.status === "HOLD")?._count
        .status || 0,
  };

  const taskGrouped = await prisma.task.groupBy({
    by: ["status"],
    where: {
      createdAt: {
        gte: startofMonth,
        lte: endofMonth,
      },
    },
    _count: {
      status: true,
    },
  });
  const taskStatus = {
    PENDING:
      taskGrouped.find((task) => task.status === "PENDING")?._count.status || 0,
    IN_PROGRESS:
      taskGrouped.find((task) => task.status === "IN_PROGRESS")?._count
        .status || 0,
    COMPLETED:
      taskGrouped.find((task) => task.status === "COMPLETED")?._count.status ||
      0,
  };

  return res.status(200).json(
    new ApiResponse(200, "Dashboard Stats Fetched Successfully", {
      overview: {
        totalEmployees,
        departmentWiseEmployees,
        totalDepartments,
        totalLeaves,
        leaveStatus,
        totalUpdateRequests,
        updateRequestStatus,
        attendanceStatus,
        payrollStatus,
        taskStatus,
      },
    })
  );
});

export { adminDashboard };
