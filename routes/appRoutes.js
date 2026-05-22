import express from "express";

import { AuthController } from "../controllers/authControllers.js";
import {createRole, getRoles,updateRole,deleteRole} from "../controllers/roleController.js";
import { createRegion, getRegions, updateRegion, deleteRegion} from "../controllers/regionController.js";
import {
  createPermission,
  getPermissions,
  assignPermissionToRole,
  removePermissionFromRole,
  getRolePermissions,
  assignPermissionsToRole,
  removePermissionsFromRole,
  syncRolePermissions
} from "../controllers/permissionController.js";
import { authMiddleware} from "../middleware/authMiddleware.js";
import {
  authorize
} from "../middleware/permissionMiddleware.js";

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


export default router;