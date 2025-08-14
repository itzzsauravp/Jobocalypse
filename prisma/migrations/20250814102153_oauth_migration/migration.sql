-- AlterTable
ALTER TABLE "public"."Admin" ADD COLUMN     "provider" TEXT,
ADD COLUMN     "providerID" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Firm" ADD COLUMN     "provider" TEXT,
ADD COLUMN     "providerID" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "provider" TEXT,
ADD COLUMN     "providerID" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
