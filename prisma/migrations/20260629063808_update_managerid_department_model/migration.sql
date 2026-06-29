/*
  Warnings:

  - A unique constraint covering the columns `[managerId]` on the table `Department` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Department_managerId_key" ON "Department"("managerId");
