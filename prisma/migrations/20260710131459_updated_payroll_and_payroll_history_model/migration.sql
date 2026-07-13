/*
  Warnings:

  - You are about to drop the column `salary` on the `Payroll` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[empId,month,year]` on the table `Payroll` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `basicSalary` to the `Payroll` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issuedById` to the `Payroll` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issuerRole` to the `Payroll` table without a default value. This is not possible if the table is not empty.
  - Added the required column `month` to the `Payroll` table without a default value. This is not possible if the table is not empty.
  - Added the required column `netSalary` to the `Payroll` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Payroll` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PayrollStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'HOLD');

-- DropIndex
DROP INDEX "Payroll_empId_issueDate_key";

-- AlterTable
ALTER TABLE "Payroll" DROP COLUMN "salary",
ADD COLUMN     "allowance" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "basicSalary" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "bonus" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "deductions" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "issuedById" INTEGER NOT NULL,
ADD COLUMN     "issuerRole" "Role" NOT NULL,
ADD COLUMN     "month" INTEGER NOT NULL,
ADD COLUMN     "netSalary" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "paymentDate" TIMESTAMP(3),
ADD COLUMN     "presentDays" INTEGER,
ADD COLUMN     "status" "PayrollStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "totalDays" INTEGER,
ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payroll_empId_month_year_key" ON "Payroll"("empId", "month", "year");

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "Employee"("empId") ON DELETE RESTRICT ON UPDATE CASCADE;
