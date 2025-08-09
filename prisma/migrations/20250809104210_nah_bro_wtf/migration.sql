/*
  Warnings:

  - Added the required column `password` to the `Firm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Firm" ADD COLUMN     "password" TEXT NOT NULL;
