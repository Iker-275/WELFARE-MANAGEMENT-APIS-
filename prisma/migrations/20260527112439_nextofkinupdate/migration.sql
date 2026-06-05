-- AlterTable
ALTER TABLE "next_of_kin" ADD COLUMN     "alternativePhone" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "remarks" TEXT;

-- CreateIndex
CREATE INDEX "next_of_kin_nationalId_idx" ON "next_of_kin"("nationalId");
