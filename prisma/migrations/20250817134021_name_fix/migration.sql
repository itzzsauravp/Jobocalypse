/*
  Warnings:

  - The values [freshers] on the enum `VACANCY_LEVEL` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."VACANCY_LEVEL_new" AS ENUM ('fresher', 'junior', 'mid-level', 'senior');
ALTER TABLE "public"."Vacancy" ALTER COLUMN "level" TYPE "public"."VACANCY_LEVEL_new"[] USING ("level"::text::"public"."VACANCY_LEVEL_new"[]);
ALTER TYPE "public"."VACANCY_LEVEL" RENAME TO "VACANCY_LEVEL_old";
ALTER TYPE "public"."VACANCY_LEVEL_new" RENAME TO "VACANCY_LEVEL";
DROP TYPE "public"."VACANCY_LEVEL_old";
COMMIT;

-- AlterEnum
ALTER TYPE "public"."VACANCY_TYPE" ADD VALUE 'hybrid';
