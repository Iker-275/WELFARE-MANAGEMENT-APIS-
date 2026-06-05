-- AlterTable
ALTER TABLE "import_jobs" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "queueJobId" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "successfulRecords" INTEGER;

-- CreateTable
CREATE TABLE "import_job_errors" (
    "id" TEXT NOT NULL,
    "importJobId" TEXT NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "error" TEXT NOT NULL,
    "rowData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "import_job_errors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "import_job_errors_importJobId_idx" ON "import_job_errors"("importJobId");

-- CreateIndex
CREATE INDEX "import_jobs_status_idx" ON "import_jobs"("status");

-- AddForeignKey
ALTER TABLE "import_job_errors" ADD CONSTRAINT "import_job_errors_importJobId_fkey" FOREIGN KEY ("importJobId") REFERENCES "import_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
