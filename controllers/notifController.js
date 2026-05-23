import { NotificationService }
from "../services/notifService.js";

const service = new NotificationService();

export const NotificationController = {

  async create(req, res, next) {

    try {

      const notification =
        await service.createNotification( req.body, req.user.id);

      return res.status(201).json({
        success: true,
        message: "Notification created successfully",
        data: notification,
      });

    } catch (error) {

      next(error);
      return res.status(500).json({
        success: false,
        message:   "Failed to create notification",
      });

    }

  },

  async myNotifications( req, res, next) {

    try {

      const page =  Number(req.query.page) || 1;

      const limit = Number(req.query.limit) || 20;

      const notifications = await service.getMyNotifications(
          req.user.id,
          page,
          limit
        );

      return res.json({
        success: true,
        data: notifications,
      });

    } catch (error) {

      next(error);
        return res.status(500).json({
        success: false,
        message: "Failed to fetch notifications",
      });

    }

  },

  async unreadCount( req, res, next) {

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
        message:"Failed to fetch unread count",
      });

    }

  },

  async markAsRead( req, res, next) {

    try {

      await service.markAsRead(req.params.id, req.user.id);

      return res.json({
        success: true,
        message: "Notification marked as read",
      });

    } catch (error) {

      next(error);
        return res.status(500).json({
        success: false,
        message: "Failed to mark notification as read",
      });

    }

  },

  async markAllAsRead( req, res,next ) {

    try {

      await service.markAllAsRead( req.user.id );

      return res.json({
        success: true,
        message:
          "All notifications marked as read",
      });

    } catch (error) {

      next(error);
      return res.status(500).json({
        success: false,
        message: "Failed to mark all notifications as read",
      });

    }

  },

};