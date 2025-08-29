/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - Made the column `username` on table `Admin` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `email` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Made the column `username` on table `Business` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Admin" ALTER COLUMN "username" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Business" ADD COLUMN     "email" TEXT NOT NULL,
ALTER COLUMN "username" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "username" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Business_email_key" ON "public"."Business"("email");
