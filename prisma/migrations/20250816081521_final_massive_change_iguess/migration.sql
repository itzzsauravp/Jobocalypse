/*
  Warnings:

  - You are about to drop the column `profilePic` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `publicID` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `profilePic` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `publicID` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Vacancy` table. All the data in the column will be lost.
  - You are about to drop the `Documents` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ASSETS_TYPE" AS ENUM ('profile_pic', 'document', 'banner_image', 'image');

-- DropForeignKey
ALTER TABLE "public"."Documents" DROP CONSTRAINT "Documents_businessID_fkey";

-- DropForeignKey
ALTER TABLE "public"."Documents" DROP CONSTRAINT "Documents_userID_fkey";

-- AlterTable
ALTER TABLE "public"."Admin" DROP COLUMN "profilePic",
DROP COLUMN "publicID";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "profilePic",
DROP COLUMN "publicID";

-- AlterTable
ALTER TABLE "public"."Vacancy" DROP COLUMN "images";

-- DropTable
DROP TABLE "public"."Documents";

-- CreateTable
CREATE TABLE "public"."UserAssets" (
    "id" UUID NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "type" "public"."ASSETS_TYPE" NOT NULL,
    "format" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" UUID NOT NULL,

    CONSTRAINT "UserAssets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BusinessAssets" (
    "id" UUID NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "type" "public"."ASSETS_TYPE" NOT NULL,
    "format" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."STATUS" NOT NULL DEFAULT 'pending',
    "businessID" UUID,

    CONSTRAINT "BusinessAssets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VacancyAssets" (
    "id" UUID NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "type" "public"."ASSETS_TYPE" NOT NULL,
    "format" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vacancyID" UUID NOT NULL,

    CONSTRAINT "VacancyAssets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdminAssets" (
    "id" UUID NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "type" "public"."ASSETS_TYPE" NOT NULL,
    "format" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminID" UUID NOT NULL,

    CONSTRAINT "AdminAssets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."UserAssets" ADD CONSTRAINT "UserAssets_userID_fkey" FOREIGN KEY ("userID") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BusinessAssets" ADD CONSTRAINT "BusinessAssets_businessID_fkey" FOREIGN KEY ("businessID") REFERENCES "public"."Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VacancyAssets" ADD CONSTRAINT "VacancyAssets_vacancyID_fkey" FOREIGN KEY ("vacancyID") REFERENCES "public"."Vacancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdminAssets" ADD CONSTRAINT "AdminAssets_adminID_fkey" FOREIGN KEY ("adminID") REFERENCES "public"."Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
