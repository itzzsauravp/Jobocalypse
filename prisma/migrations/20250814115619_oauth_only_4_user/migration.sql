/*
  Warnings:

  - You are about to drop the column `provider` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `providerID` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `Firm` table. All the data in the column will be lost.
  - You are about to drop the column `providerID` on the `Firm` table. All the data in the column will be lost.
  - Made the column `password` on table `Admin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `Firm` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Admin" DROP COLUMN "provider",
DROP COLUMN "providerID",
ALTER COLUMN "password" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Firm" DROP COLUMN "provider",
DROP COLUMN "providerID",
ALTER COLUMN "password" SET NOT NULL;
