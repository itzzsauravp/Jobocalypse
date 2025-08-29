-- CreateEnum
CREATE TYPE "public"."APPLICATION_STATUS" AS ENUM ('pending', 'reviewed', 'shortlisted', 'interview', 'accepted', 'rejected', 'hired');

-- CreateTable
CREATE TABLE "public"."Applicant" (
    "id" UUID NOT NULL,
    "userID" UUID NOT NULL,
    "vacancyID" UUID NOT NULL,
    "cv_link" TEXT NOT NULL,
    "status" "public"."APPLICATION_STATUS" NOT NULL DEFAULT 'pending',

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Applicant" ADD CONSTRAINT "Applicant_userID_fkey" FOREIGN KEY ("userID") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Applicant" ADD CONSTRAINT "Applicant_vacancyID_fkey" FOREIGN KEY ("vacancyID") REFERENCES "public"."Vacancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
