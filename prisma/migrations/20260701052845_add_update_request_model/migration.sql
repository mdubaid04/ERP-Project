/*
  Warnings:

  - The `status` column on the `Leave` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "UpdateField" AS ENUM ('PhoneNo', 'Email');

-- AlterTable
ALTER TABLE "Leave" DROP COLUMN "status",
ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "LeaveStatus";

-- CreateTable
CREATE TABLE "UpdateRequest" (
    "requestId" SERIAL NOT NULL,
    "empId" INTEGER NOT NULL,
    "fieldName" "UpdateField" NOT NULL,
    "oldValue" TEXT NOT NULL,
    "newValue" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" INTEGER,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UpdateRequest_pkey" PRIMARY KEY ("requestId")
);

-- AddForeignKey
ALTER TABLE "UpdateRequest" ADD CONSTRAINT "UpdateRequest_empId_fkey" FOREIGN KEY ("empId") REFERENCES "Employee"("empId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpdateRequest" ADD CONSTRAINT "UpdateRequest_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "Employee"("empId") ON DELETE SET NULL ON UPDATE CASCADE;
