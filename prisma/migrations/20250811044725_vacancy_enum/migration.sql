/*
  Warnings:

  - Added the required column `type` to the `Vacancy` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."VACANCY_ENUM" AS ENUM ('on-site', 'remote');

-- AlterTable
ALTER TABLE "public"."Vacancy" ADD COLUMN     "type" "public"."VACANCY_ENUM" NOT NULL;
