import { prisma } from "../index.js";

export class AnnouncementRepository {

  // ======================================================
  // CREATE ANNOUNCEMENT
  // ======================================================

  async createAnnouncement(data) {

    return prisma.announcement.create({
      data,
    });

  }

  // ======================================================
  // CREATE TARGET ROLES
  // ======================================================

  async createAnnouncementRoles(
    announcementId,
    roleIds
  ) {

    if (!roleIds?.length) {
      return;
    }

    return prisma.announcementRole.createMany({
      data: roleIds.map(roleId => ({
        announcementId,
        roleId,
      })),

      skipDuplicates: true,
    });

  }

  // ======================================================
  // GET USERS BY ROLES
  // ======================================================

  async getUsersByRoles(roleIds) {

    return prisma.user.findMany({
      where: {
        roleId: {
          in: roleIds,
        },

        isActive: true,
      },

      select: {
        id: true,
      },
    });

  }

  // ======================================================
  // GET ALL USERS
  // ======================================================

  async getAllUsers() {

    return prisma.user.findMany({
      where: {
        isActive: true,
      },

      select: {
        id: true,
      },
    });

  }

  // ======================================================
  // CREATE RECIPIENTS
  // ======================================================

  async createRecipients(
    announcementId,
    userIds
  ) {

    return prisma.announcementRecipient.createMany({
      data: userIds.map(userId => ({
        announcementId,
        userId,
      })),

      skipDuplicates: true,
    });

  }

  // ======================================================
  // GET USER ANNOUNCEMENTS
  // ======================================================

  async getUserAnnouncements(
    userId,
    page = 1,
    limit = 20
  ) {

    const skip =
      (page - 1) * limit;

    return prisma.announcementRecipient.findMany({
      where: {
        userId,

        announcement: {
          isPublished: true,

          OR: [
            {
              expiresAt: null,
            },

            {
              expiresAt: {
                gt: new Date(),
              },
            },
          ],
        },
      },

      include: {

        announcement: {

          include: {

            createdBy: {

              select: {
                id: true,
                firstName: true,
                lastName: true,
              },

            },

          },

        },

      },

      orderBy: {
        createdAt: "desc",
      },

      skip,
      take: limit,
    });

  }

  // ======================================================
  // GET UNREAD COUNT
  // ======================================================

  async getUnreadCount(userId) {

    return prisma.announcementRecipient.count({
      where: {
        userId,
        isRead: false,

        announcement: {
          isPublished: true,
        },
      },
    });

  }

  // ======================================================
  // MARK READ
  // ======================================================

  async markAsRead(
    announcementId,
    userId
  ) {

    return prisma.announcementRecipient.update({
      where: {
        announcementId_userId: {
          announcementId,
          userId,
        },
      },

      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

  }

  // ======================================================
  // MARK ALL READ
  // ======================================================

  async markAllAsRead(userId) {

    return prisma.announcementRecipient.updateMany({
      where: {
        userId,
        isRead: false,
      },

      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

  }

  // ======================================================
  // PUBLISH
  // ======================================================

  async publishAnnouncement(id) {

    return prisma.announcement.update({
      where: { id },

      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
    });

  }

  // ======================================================
  // UNPUBLISH
  // ======================================================

  async unpublishAnnouncement(id) {

    return prisma.announcement.update({
      where: { id },

      data: {
        isPublished: false,
      },
    });

  }

}