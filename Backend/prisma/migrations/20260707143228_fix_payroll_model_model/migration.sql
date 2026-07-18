/*
  Warnings:

  - A unique constraint covering the columns `[empId,issueDate]` on the table `Payroll` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Payroll_empId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Payroll_empId_issueDate_key" ON "Payroll"("empId", "issueDate");
