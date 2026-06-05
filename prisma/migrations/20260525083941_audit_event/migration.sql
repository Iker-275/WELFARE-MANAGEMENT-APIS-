-- CreateEnum
CREATE TYPE "AuditSeverity" AS ENUM ('info', 'warning', 'critical');

-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('success', 'failed');

-- DropIndex
DROP INDEX "audit_events_userId_idx";

-- AlterTable
ALTER TABLE "audit_events" ADD COLUMN     "affectedUserId" TEXT,
ADD COLUMN     "endpoint" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "method" TEXT,
ADD COLUMN     "module" TEXT,
ADD COLUMN     "performedById" TEXT,
ADD COLUMN     "requestId" TEXT,
ADD COLUMN     "severity" "AuditSeverity" NOT NULL DEFAULT 'info',
ADD COLUMN     "status" "AuditStatus" NOT NULL DEFAULT 'success';

-- CreateIndex
CREATE INDEX "audit_events_performedById_idx" ON "audit_events"("performedById");

-- CreateIndex
CREATE INDEX "audit_events_affectedUserId_idx" ON "audit_events"("affectedUserId");

-- CreateIndex
CREATE INDEX "audit_events_action_idx" ON "audit_events"("action");

-- CreateIndex
CREATE INDEX "audit_events_module_idx" ON "audit_events"("module");

-- CreateIndex
CREATE INDEX "audit_events_severity_idx" ON "audit_events"("severity");

-- CreateIndex
CREATE INDEX "audit_events_status_idx" ON "audit_events"("status");

-- CreateIndex
CREATE INDEX "audit_events_createdAt_idx" ON "audit_events"("createdAt");

-- AddForeignKey
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_affectedUserId_fkey" FOREIGN KEY ("affectedUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
