-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deactivatedAt" TIMESTAMP(3),
ADD COLUMN     "deactivatedById" TEXT,
ADD COLUMN     "deactivationReason" TEXT,
ADD COLUMN     "revokedAt" TIMESTAMP(3),
ADD COLUMN     "suspendedAt" TIMESTAMP(3),
ADD COLUMN     "suspendedUntil" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_deactivatedById_fkey" FOREIGN KEY ("deactivatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
