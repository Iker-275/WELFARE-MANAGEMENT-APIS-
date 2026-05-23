import { NotificationRepository }
from "../repository/notifRepo.js";

const repo =
  new NotificationRepository();

export class NotificationService {

  // ======================================================
  // CREATE NOTIFICATION
  // ======================================================

 
  async createNotification(data, createdById) {

  const {
    title,
    message,
    type,
    metadata,

    sendToAll,

    roleIds = [],
    regionIds = [],

  } = data;

  // CREATE NOTIFICATION
  if ( !sendToAll &&roleIds.length === 0 &&regionIds.length === 0) {
  throw new Error( "Select at least one role or region" );
}

  const notification =await repo.createNotification({

      title,
      message,
      type,
      metadata,

      sendToAll,

      createdById,

    });

  // STORE ROLES

  if (!sendToAll) {

    await repo.createNotificationRoles(
      notification.id,
      roleIds
    );

    await repo.createNotificationRegions(
      notification.id,
      regionIds
    );

  }

  // GET USERS

  const users =
    await repo.getTargetUsers({

      roleIds,
      regionIds,
      sendToAll,

    });

  // CREATE RECIPIENTS

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