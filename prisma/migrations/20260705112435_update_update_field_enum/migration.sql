/*
  Warnings:

  - The values [PhoneNo,Email] on the enum `UpdateField` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UpdateField_new" AS ENUM ('PHONENO', 'EMAIL');
ALTER TABLE "UpdateRequest" ALTER COLUMN "fieldName" TYPE "UpdateField_new" USING ("fieldName"::text::"UpdateField_new");
ALTER TYPE "UpdateField" RENAME TO "UpdateField_old";
ALTER TYPE "UpdateField_new" RENAME TO "UpdateField";
DROP TYPE "public"."UpdateField_old";
COMMIT;
