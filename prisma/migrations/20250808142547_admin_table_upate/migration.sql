/*
  Warnings:

  - Added the required column `email` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Admin" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "refreshToken" TEXT;
