/*
  Warnings:

  - You are about to drop the column `documents` on the `Business` table. All the data in the column will be lost.
  - The `status` column on the `Business` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."STATUS" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "public"."Business" DROP COLUMN "documents",
DROP COLUMN "status",
ADD COLUMN     "status" "public"."STATUS" NOT NULL DEFAULT 'pending';

-- DropEnum
DROP TYPE "public"."BUSINESS_STATUS";

-- CreateTable
CREATE TABLE "public"."Documents" (
    "id" UUID NOT NULL,
    "secureURL" TEXT NOT NULL,
    "publicID" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."STATUS" NOT NULL DEFAULT 'pending',
    "businessID" UUID,
    "userID" UUID,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Documents" ADD CONSTRAINT "Documents_businessID_fkey" FOREIGN KEY ("businessID") REFERENCES "public"."Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Documents" ADD CONSTRAINT "Documents_userID_fkey" FOREIGN KEY ("userID") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
