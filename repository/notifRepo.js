import { prisma } from "../index.js";

export class NotificationRepository {

  // ======================================================
  // CREATE NOTIFICATION
  // ======================================================

  async createNotification(data) {

    return prisma.notification.create({
      data,
    });

  }

  // ======================================================
  // CREATE TARGET ROLES
  // ======================================================

  async createNotificationRoles(
    notificationId,
    roleIds
  ) {

    if (!roleIds?.length) {
      return;
    }

    return prisma.notificationRole.createMany({
      data: roleIds.map(roleId => ({
        notificationId,
        roleId,
      })),

      skipDuplicates: true,
    });

  }

  // ======================================================
  // GET USERS BY ROLE IDS
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
    notificationId,
    userIds
  ) {

    return prisma.notificationRecipient.createMany({
      data: userIds.map(userId => ({
        notificationId,
        userId,
      })),

      skipDuplicates: true,
    });

  }

  // ======================================================
  // GET USER NOTIFICATIONS
  // ======================================================

  async getUserNotifications(
    userId,
    page = 1,
    limit = 20
  ) {

    const skip =
      (page - 1) * limit;

    return prisma.notificationRecipient.findMany({
      where: {
        userId,
      },

      include: {
        notification: {
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
  // UNREAD COUNT
  // ======================================================

  async getUnreadCount(userId) {

    return prisma.notificationRecipient.count({
      where: {
        userId,
        isRead: false,
      },
    });

  }

  // ======================================================
  // MARK ONE READ
  // ======================================================

  async markAsRead(
    notificationId,
    userId
  ) {

    return prisma.notificationRecipient.update({
      where: {
        notificationId_userId: {
          notificationId,
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

    return prisma.notificationRecipient.updateMany({
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

}