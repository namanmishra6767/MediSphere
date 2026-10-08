import { Router } from "express";

import {
  createDoctorAccount,
  getUsers,
} from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.get(
  "/users",
  requireAuth,
  requireRole("admin"),
  getUsers
);

router.post(
  "/doctors",
  requireAuth,
  requireRole("admin"),
  createDoctorAccount
);

export default router;