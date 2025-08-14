-- CreateEnum
CREATE TYPE "public"."VACANCY_TYPE" AS ENUM ('on-site', 'remote');

-- CreateEnum
CREATE TYPE "public"."VACANCY_LEVEL" AS ENUM ('freshers', 'junior', 'mid-level', 'senior');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "address" TEXT,
    "phoneNumber" TEXT,
    "refreshToken" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "profilePic" TEXT,
    "publicID" TEXT,
    "provider" TEXT,
    "providerID" TEXT,
    "worksAtID" UUID,
    "isBusinessAccount" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Business" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "website" TEXT,
    "description" TEXT,
    "address" TEXT,
    "phoneNumber" TEXT,
    "documents" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userID" UUID NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Vacancy" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "type" "public"."VACANCY_TYPE" NOT NULL,
    "level" "public"."VACANCY_LEVEL"[],
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessID" UUID NOT NULL,

    CONSTRAINT "Vacancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT,
    "phoneNumber" TEXT,
    "refreshToken" TEXT,
    "profilePic" TEXT,
    "publicID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Business_userID_key" ON "public"."Business"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- AddForeignKey
ALTER TABLE "public"."Business" ADD CONSTRAINT "Business_userID_fkey" FOREIGN KEY ("userID") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vacancy" ADD CONSTRAINT "Vacancy_businessID_fkey" FOREIGN KEY ("businessID") REFERENCES "public"."Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
