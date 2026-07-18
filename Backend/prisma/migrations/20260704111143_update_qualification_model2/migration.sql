/*
  Warnings:

  - Added the required column `grade` to the `Qualification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Qualification" ADD COLUMN     "grade" TEXT NOT NULL;
