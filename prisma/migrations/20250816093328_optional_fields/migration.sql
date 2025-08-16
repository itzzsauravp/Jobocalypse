-- AlterTable
ALTER TABLE "public"."UserAssets" ALTER COLUMN "secureUrl" DROP NOT NULL,
ALTER COLUMN "publicId" DROP NOT NULL,
ALTER COLUMN "format" DROP NOT NULL;
