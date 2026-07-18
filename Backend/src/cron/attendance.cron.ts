import cron from "node-cron";
import { prisma } from "../db/prisma";
import { AttendanceStatus } from "../../generated/prisma/enums";

//(min,hour,dayofmonth,month,dayofweek)

cron.schedule(
  "55 23 * * *",
  async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const activeEmployees = await prisma.employee.findMany({
        where: {
          isActive: true,
        },
        select: {
          empId: true,
        },
      });
      const existingAttendances = await prisma.attendance.findMany({
        where: {
          date: today,
        },
        select: {
          empId: true,
        },
      });
      const preseentEmpIds = new Set(
        existingAttendances.map((emp) => emp.empId)
      ); // set is used for performance optimization .has() is O(1) as compare to .include() of array which is o(n)

      const absentEmployees = activeEmployees.filter(
        (emp) => !preseentEmpIds.has(emp.empId)
      );

      if (absentEmployees.length === 0) {
        console.log("No Absent Employee Found");
        return;
      }

      const absentData = absentEmployees.map((emp) => ({
        empId: emp.empId,
        date: today,
        status: AttendanceStatus.ABSENT,
      }));

      const result = await prisma.attendance.createMany({
        data: absentData,
        skipDuplicates: true,
      });
      console.log(
        `Marked ${result.count} Absent Employee as Absent for ${today.toDateString()}`
      );
    } catch (error) {
      console.log("Absent Marking Cron Job Failed Due To Some Error", error);
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);
