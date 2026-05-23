import { AnnouncementRepository }
from "../repository/announcementRepo.js";

const repo = new AnnouncementRepository();

export class AnnouncementService {

  // ======================================================
  // CREATE
  // ======================================================

  

  async createAnnouncement(data, createdById) {

  const {
    title,
    content,
    attachments,
    expiresAt,

    sendToAll,

    roleIds = [],
    regionIds = [],

    isPublished = false,

  } = data;

  // VALIDATION

  if (!sendToAll && roleIds.length === 0 && regionIds.length === 0) {
    throw new Error( "Select at least one role or region");
  }

  // CREATE ANNOUNCEMENT

  const announcement =
    await repo.createAnnouncement({

      title,
      content,

      attachments,

      expiresAt,

      sendToAll,

      isPublished,

      publishedAt:
        isPublished
          ? new Date()
          : null,

      createdById,

    });

  // STORE TARGETS

  if (!sendToAll) {

    await repo.createAnnouncementRoles(
      announcement.id,
      roleIds
    );

    await repo.createAnnouncementRegions(
      announcement.id,
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

    announcement.id,

    users.map(user => user.id)

  );

  return announcement;

}

  // ======================================================
  // MY ANNOUNCEMENTS
  // ======================================================

  async getMyAnnouncements(userId,page,limit) {

    return repo.getUserAnnouncements(
      userId,
      page,
      limit
    );

  }

  // ======================================================
  // UNREAD COUNT
  // ======================================================

  async getUnreadCount(userId) {

    return repo.getUnreadCount(
      userId
    );

  }

  // ======================================================
  // MARK READ
  // ======================================================

  async markAsRead( announcementId, userId) {

    return repo.markAsRead(
      announcementId,
      userId
    );

  }

  // ======================================================
  // MARK ALL READ
  // ======================================================

  async markAllAsRead(userId) {

    return repo.markAllAsRead(
      userId
    );

  }

  // ======================================================
  // PUBLISH
  // ======================================================

  async publishAnnouncement(id) {

    return repo.publishAnnouncement(
      id
    );

  }

  // ======================================================
  // UNPUBLISH
  // ======================================================

  async unpublishAnnouncement(id) {

    return repo.unpublishAnnouncement(
      id
    );

  }

}