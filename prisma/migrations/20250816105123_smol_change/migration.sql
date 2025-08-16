/*
  Warnings:

  - Made the column `businessID` on table `BusinessAssets` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."BusinessAssets" DROP CONSTRAINT "BusinessAssets_businessID_fkey";

-- AlterTable
ALTER TABLE "public"."BusinessAssets" ALTER COLUMN "businessID" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."BusinessAssets" ADD CONSTRAINT "BusinessAssets_businessID_fkey" FOREIGN KEY ("businessID") REFERENCES "public"."Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
