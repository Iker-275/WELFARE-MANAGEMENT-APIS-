import { NotificationRepository }
from "../repository/notifRepo.js";

const repo =
  new NotificationRepository();

export class NotificationService {

  // ======================================================
  // CREATE NOTIFICATION
  // ======================================================

  async createNotification(data,createdById) {

    const {
      title,
      message,
      type,
      metadata,
      sendToAll,
      roleIds = [],
    } = data;

    // CREATE NOTIFICATION

    const notification = await repo.createNotification({

        title,
        message,
        type,
        metadata,

        sendToAll,

        createdById,

      });

    // STORE TARGET ROLES

    if (!sendToAll) {

      await repo.createNotificationRoles(
        notification.id,
        roleIds
      );

    }

    // GET RECIPIENT USERS

    let users = [];

    if (sendToAll) {

      users = await repo.getAllUsers();

    } else {

      users =  await repo.getUsersByRoles( roleIds);

    }

    // CREATE RECIPIENT RECORDS

    await repo.createRecipients(

      notification.id,

      users.map(user => user.id)

    );

    return notification;

  }

  // ======================================================
  // GET MY NOTIFICATIONS
  // ======================================================

  async getMyNotifications( userId, page, limit) {

    return repo.getUserNotifications(
      userId,
      page,
      limit
    );

  }

  // ======================================================
  // GET UNREAD COUNT
  // ======================================================

  async getUnreadCount(userId) {

    return repo.getUnreadCount(  userId);

  }

  // ======================================================
  // MARK AS READ
  // ======================================================

  async markAsRead(notificationId,userId ) {

    return repo.markAsRead(
      notificationId,
      userId
    );

  }

  // ======================================================
  // MARK ALL READ
  // ======================================================

  async markAllAsRead(userId) {

    return repo.markAllAsRead(  userId);

  }

}