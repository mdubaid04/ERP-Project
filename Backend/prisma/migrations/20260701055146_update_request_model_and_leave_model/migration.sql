-- AlterTable
ALTER TABLE "Leave" ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedBy" INTEGER,
ADD COLUMN     "reviewerRole" "Role";

-- AlterTable
ALTER TABLE "UpdateRequest" ADD COLUMN     "reviewerRole" "Role";

-- AddForeignKey
ALTER TABLE "Leave" ADD CONSTRAINT "Leave_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "Employee"("empId") ON DELETE SET NULL ON UPDATE CASCADE;
