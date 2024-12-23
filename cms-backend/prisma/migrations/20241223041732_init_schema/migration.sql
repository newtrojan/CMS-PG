-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'CCA', 'CCM', 'ADMIN', 'SUDO');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "LaborType" AS ENUM ('FLAT', 'MULTIPLIER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claims" (
    "id" TEXT NOT NULL,
    "claimNumber" TEXT NOT NULL,
    "status" "ClaimStatus" NOT NULL DEFAULT 'DRAFT',
    "assignedToId" TEXT,
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_info" (
    "id" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "vin" TEXT NOT NULL,
    "claimId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicle_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parts" (
    "id" TEXT NOT NULL,
    "partNumber" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "claimId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "claimId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "billingEmail" TEXT NOT NULL,
    "carrierNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insurers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_rules" (
    "id" TEXT NOT NULL,
    "domesticWindshield" DOUBLE PRECISION NOT NULL,
    "domesticTempered" DOUBLE PRECISION NOT NULL,
    "foreignWindshield" DOUBLE PRECISION NOT NULL,
    "foreignTempered" DOUBLE PRECISION NOT NULL,
    "oem" DOUBLE PRECISION NOT NULL,
    "laborType" "LaborType" NOT NULL,
    "laborTypeValue" DOUBLE PRECISION NOT NULL,
    "glassLaborRate" DOUBLE PRECISION NOT NULL,
    "defaultHourlyRate" DOUBLE PRECISION NOT NULL,
    "laborDomesticWindshield" DOUBLE PRECISION NOT NULL,
    "laborDomesticTempered" DOUBLE PRECISION NOT NULL,
    "laborForeignWindshield" DOUBLE PRECISION NOT NULL,
    "laborForeignTempered" DOUBLE PRECISION NOT NULL,
    "otherKitFlat" DOUBLE PRECISION NOT NULL,
    "kitFlat1" DOUBLE PRECISION NOT NULL,
    "kitFlat1_5" DOUBLE PRECISION NOT NULL,
    "kitFlat2" DOUBLE PRECISION NOT NULL,
    "kitFlat2_5" DOUBLE PRECISION NOT NULL,
    "kitFlat3" DOUBLE PRECISION NOT NULL,
    "insurerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "claims_claimNumber_key" ON "claims"("claimNumber");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_info_claimId_key" ON "vehicle_info"("claimId");

-- CreateIndex
CREATE UNIQUE INDEX "pricing_rules_insurerId_key" ON "pricing_rules"("insurerId");

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_info" ADD CONSTRAINT "vehicle_info_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parts" ADD CONSTRAINT "parts_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pricing_rules" ADD CONSTRAINT "pricing_rules_insurerId_fkey" FOREIGN KEY ("insurerId") REFERENCES "insurers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
