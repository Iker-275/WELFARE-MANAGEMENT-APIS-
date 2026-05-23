import { AnnouncementRepository }
from "../repository/announcementRepo.js";

const repo = new AnnouncementRepository();

export class AnnouncementService {

  // ======================================================
  // CREATE
  // ======================================================

  async createAnnouncement( data, createdById) {

    const {
      title,
      content,
      attachments,
      expiresAt,
      sendToAll,
      roleIds = [],
      isPublished = false,
    } = data;

    const announcement = await repo.createAnnouncement({

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

    // STORE TARGET ROLES

    if (!sendToAll) {

      await repo.createAnnouncementRoles(
        announcement.id,
        roleIds
      );

    }

    // GET USERS

    let users = [];

    if (sendToAll) {

      users =
        await repo.getAllUsers();

    } else {

      users =
        await repo.getUsersByRoles(
          roleIds
        );

    }

    // CREATE RECIPIENTS

    await repo.createRecipients(

      announcement.id,

      users.map(
        user => user.id
      )

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