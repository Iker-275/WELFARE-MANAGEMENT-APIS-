-- AlterTable
ALTER TABLE "file_uploads" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_employmentStatus_idx" ON "users"("employmentStatus");

-- CreateIndex
CREATE INDEX "users_isActive_idx" ON "users"("isActive");

-- CreateIndex
CREATE INDEX "users_isNecMember_idx" ON "users"("isNecMember");

-- CreateIndex
CREATE INDEX "users_eligibleForElection_idx" ON "users"("eligibleForElection");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE INDEX "users_firstName_idx" ON "users"("firstName");

-- CreateIndex
CREATE INDEX "users_lastName_idx" ON "users"("lastName");
