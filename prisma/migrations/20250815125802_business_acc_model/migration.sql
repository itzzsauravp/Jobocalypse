/*
  Warnings:

  - Added the required column `updatedAt` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verifiedAt` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Business` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `Business` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phoneNumber` on table `Business` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."BUSINESS_STATUS" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "public"."Business" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "public"."BUSINESS_STATUS" NOT NULL DEFAULT 'pending',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verifiedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "phoneNumber" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "bio" TEXT;

-- AlterTable
ALTER TABLE "public"."Vacancy" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
