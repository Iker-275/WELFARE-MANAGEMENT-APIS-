-- CreateTable
CREATE TABLE "notification_regions" (
    "id" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,

    CONSTRAINT "notification_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcement_regions" (
    "id" TEXT NOT NULL,
    "announcementId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,

    CONSTRAINT "announcement_regions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notification_regions_notificationId_regionId_key" ON "notification_regions"("notificationId", "regionId");

-- CreateIndex
CREATE UNIQUE INDEX "announcement_regions_announcementId_regionId_key" ON "announcement_regions"("announcementId", "regionId");

-- AddForeignKey
ALTER TABLE "notification_regions" ADD CONSTRAINT "notification_regions_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_regions" ADD CONSTRAINT "notification_regions_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_regions" ADD CONSTRAINT "announcement_regions_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_regions" ADD CONSTRAINT "announcement_regions_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
