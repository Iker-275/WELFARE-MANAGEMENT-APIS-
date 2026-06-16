import express from "express";

import { AuthController } from "../controllers/authControllers.js";
import {createRole, getRoles,updateRole,deleteRole} from "../controllers/roleController.js";
import { createRegion, getRegions, updateRegion, deleteRegion} from "../controllers/regionController.js";
import { UserController }from "../controllers/userController.js";
import {createPermission, getPermissions, assignPermissionToRole,removePermissionFromRole,getRolePermissions,assignPermissionsToRole, removePermissionsFromRole, syncRolePermissions} from "../controllers/permissionController.js";
import { authMiddleware} from "../middleware/authMiddleware.js";
import { authorize} from "../middleware/permissionMiddleware.js";
import { NotificationController} from "../controllers/notifController.js";
import {AnnouncementController} from "../controllers/announcementController.js";
import { getCompletionStatus } from "../controllers/profileController.js";
// import { FileController } from "../controllers/fileController.js";
import { NextOfKinController }from "../controllers/nextOfKinController.js";
// import { ImportController } from "../controllers/importController.js";

const router = express.Router();

//example usage permisions middlware authorize("create_role"),
//auth
router.post( "/register", AuthController.register);
router.post("/verify-email", AuthController.verifyEmailOTP);
router.post("/login", AuthController.login);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/verify-forgot-password-otp",AuthController.verifyForgotPasswordOTP);
router.post("/reset-password", AuthController.resetPassword);

router.use(authMiddleware);

//roles
router.post("/roles",authMiddleware, createRole);
router.get("/roles", authMiddleware, getRoles);
router.patch("/roles/:id", authMiddleware, updateRole);
router.delete("/roles/:id", authMiddleware, deleteRole);
router.post(
  "/roles/:roleId/assign",
  authMiddleware,
  assignPermissionsToRole
);

router.delete(
  "/roles/:roleId/remove",
  authMiddleware,
  removePermissionsFromRole
);

router.put(
  "/roles/:roleId/sync",
  authMiddleware,
  syncRolePermissions
);

//regions
router.post("/regions", authMiddleware, createRegion);
router.get("/regions", authMiddleware, getRegions);
router.patch("/regions/:id", authMiddleware, updateRegion);
router.delete("/regions/:id", authMiddleware, deleteRegion);

//permissions
//authorize("create_permission")
router.post("/permissions",authMiddleware,createPermission);
router.get("/permissions",authMiddleware,getPermissions);
router.post("/permissions/:roleId",authMiddleware, assignPermissionToRole);
router.get("/permissions/:roleId",authMiddleware,getRolePermissions);
router.delete("/permissions/:roleId/:permissionId",authMiddleware, removePermissionFromRole);

//notifications
router.post(
  "/notifications",
  authMiddleware,
  authorize("send_notification"),
  NotificationController.create
);

router.get(
  "/notifications/my",
  authMiddleware,
  NotificationController.myNotifications
);

router.get(
  "/notifications/unread-count",
  authMiddleware,
  NotificationController.unreadCount
);

router.patch(
  "/notifications/:id/read",
  authMiddleware,
  NotificationController.markAsRead
);

router.patch(
  "/notifications/read-all",
  authMiddleware,
  NotificationController.markAllAsRead
);

//announcement routes 
router.post(
  "/announcements",
  authMiddleware,
  // authorize("create_announcement"),
  AnnouncementController.create
);

router.get(
  "/announcements/my",
  authMiddleware,
  AnnouncementController.myAnnouncements
);

router.get(
  "/announcements/unread-count",
  authMiddleware,
  AnnouncementController.unreadCount
);

router.patch(
  "/announcements/:id/read",
  authMiddleware,
  AnnouncementController.markAsRead
);

router.patch(
  "/announcements/read-all",
  authMiddleware,
  AnnouncementController.markAllAsRead
);

router.patch(
  "/announcements/:id/publish",
  authMiddleware,
  // authorize("update_announcement"),
  AnnouncementController.publish
);

router.patch(
  "/announcements/:id/unpublish",
  authMiddleware,
  // authorize("update_announcement"),
  AnnouncementController.unpublish
);

//user routes
router.get(
  "/users",
  // authorize("users.view"),
  UserController.getUsers
);

router.get(
  "/users/:id",
  // authorize("users.view"),
  UserController.getUser
);

router.put(
  "/users/:id",
  // authorize("users.update"),
  UserController.updateUser
);

router.patch(
  "/users/:id/activate",
  // authorize("users.activate"),
  UserController.activate
);

router.patch(
  "/users/:id/deactivate",
  // authorize("users.deactivate"),
  UserController.deactivate
);
router.patch( "/users/profile-photo",
 UserController.updateProfilePhoto
);

router.get(
  "/profile/completion-status",
  // authenticate,
  getCompletionStatus
);

// router.post("/profile-photo/upload-url",FileController.generateProfilePhotoUploadUrl);
// router.post("/profile-photo/save",FileController .saveProfilePhoto);

//next of kin routes
router.get("/nok/me", NextOfKinController.mine);
router.post( "/nok",NextOfKinController.save);

//
// router.post("/import/next-of-kin", ImportController.uploadNextOfKin);
export default router;