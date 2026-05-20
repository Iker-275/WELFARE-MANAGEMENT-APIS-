import express from "express";

import { AuthController } from "../controllers/authControllers.js";
import {createRole, getRoles,updateRole,deleteRole} from "../controllers/roleController.js";
import {
  createRegion,
  getRegions,
  updateRegion,
  deleteRegion
} from "../controllers/regionController.js";

const router = express.Router();
//auth
router.post( "/register", AuthController.register);

router.post("/verify-email", AuthController.verifyEmailOTP);

router.post("/login", AuthController.login);

//roles
router.post("/roles", createRole);

router.get("/roles", getRoles);
router.patch("/roles/:id", updateRole);

router.delete("/roles/:id", deleteRole);

//regions
router.post("/regions", createRegion);

router.get("/regions", getRegions);
router.patch("/regions/:id", updateRegion);

router.delete("/regions/:id", deleteRegion);

export default router;