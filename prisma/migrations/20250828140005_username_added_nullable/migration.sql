/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Admin" ADD COLUMN     "username" TEXT;

-- AlterTable
ALTER TABLE "public"."Business" ADD COLUMN     "username" TEXT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "public"."Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Business_username_key" ON "public"."Business"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");
