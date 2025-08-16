/*
  Warnings:

  - Made the column `secureUrl` on table `UserAssets` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."AdminAssets" ALTER COLUMN "publicId" DROP NOT NULL,
ALTER COLUMN "format" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserAssets" ALTER COLUMN "secureUrl" SET NOT NULL;
