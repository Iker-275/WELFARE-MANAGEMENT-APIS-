import { AnnouncementService }
from "../services/announcementService.js";

const service =new AnnouncementService();

export const AnnouncementController = {

  async create(req,res, next) {

    try {

      const announcement = await service.createAnnouncement( req.body, req.user.id);

      return res.status(201).json({
        success: true,
        message:"Announcement created successfully",
        data: announcement,
      });

    } catch (error) {

      next(error);
        return res.status(500).json({
        success: false,
        message: "Failed to create announcement",
      });

    }

  },

  async myAnnouncements( req, res,  next) {

    try {

      const page = Number(req.query.page) || 1;

      const limit =Number(req.query.limit) || 20;

      const announcements = await service.getMyAnnouncements(
          req.user.id,
          page,
          limit
        );

      return res.json({
        success: true,
        data: announcements,
      });

    } catch (error) {

      next(error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch announcements",
      });

    }

  },

  async unreadCount(req, res, next) {

    try {

      const count = await service.getUnreadCount(  req.user.id );

      return res.json({
        success: true,
        count,
      });

    } catch (error) {

      next(error);
return res.status(500).json({
        success: false,
        message: "Failed to fetch unread count",
      });   
    }

  },

  async markAsRead( req, res, next ) {

    try {

      await service.markAsRead( req.params.id, req.user.id);

      return res.json({
        success: true,
        message:  "Announcement marked as read",
      });

    } catch (error) {

      next(error);
      return res.status(500).json({
        success: false,
        message: "Failed to mark announcement as read",
      });

    }

  },

  async markAllAsRead( req, res, next) {

    try {

      await service.markAllAsRead( req.user.id);

      return res.json({
        success: true,
        message:  "All announcements marked as read",
      });

    } catch (error) {

      next(error);
      return res.status(500).json({
        success: false,
        message: "Failed to mark all announcements as read",
      });
    }

  },

  async publish(req, res, next) {

    try {

      const announcement =await service.publishAnnouncement(  req.params.id );

      return res.json({
        success: true,
        message:  "Announcement published",
        data: announcement,
      });

    } catch (error) {

      next(error);
        return res.status(500).json({
        success: false,
        message: "Failed to publish announcement",
         });

    }

  },

  async unpublish(req,res,next) {

    try {

      const announcement = await service.unpublishAnnouncement(  req.params.id);

      return res.json({
        success: true,
        message:  "Announcement unpublished",
        data: announcement,
      });

    } catch (error) {

      next(error);
        return res.status(500).json({
        success: false,
        message: "Failed to unpublish announcement",
      });

    }

  },

};