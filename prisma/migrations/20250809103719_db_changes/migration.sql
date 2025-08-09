/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `Firm` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Firm` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Firm_phoneNumber_key" ON "public"."Firm"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Firm_email_key" ON "public"."Firm"("email");
