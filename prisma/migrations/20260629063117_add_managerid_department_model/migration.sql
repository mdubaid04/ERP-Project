-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "managerId" INTEGER;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Employee"("empId") ON DELETE SET NULL ON UPDATE CASCADE;
