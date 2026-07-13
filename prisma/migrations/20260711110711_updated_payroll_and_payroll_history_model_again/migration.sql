/*
  Warnings:

  - Changed the type of `reason` on the `PayrollHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SalaryChangeReason" AS ENUM ('INCREMENT', 'DECREMENT', 'PROMOTION', 'CORRECTION', 'OTHER');

-- AlterTable
ALTER TABLE "PayrollHistory" ALTER COLUMN "oldSalary" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "newSalary" SET DATA TYPE DECIMAL(65,30),
DROP COLUMN "reason",
ADD COLUMN     "reason" "SalaryChangeReason" NOT NULL;
