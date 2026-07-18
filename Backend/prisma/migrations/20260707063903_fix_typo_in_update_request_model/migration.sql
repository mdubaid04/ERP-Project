/*
  Warnings:

  - You are about to drop the column `rejectReasons` on the `UpdateRequest` table. All the data in the column will be lost.
  - You are about to drop the column `requestReasons` on the `UpdateRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UpdateRequest" DROP COLUMN "rejectReasons",
DROP COLUMN "requestReasons",
ADD COLUMN     "rejectReason" TEXT,
ADD COLUMN     "requestReason" TEXT;
