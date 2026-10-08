import { Router } from "express";

import {
  getAdminAppointments,
} from "../controllers/adminAppointment.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.get(
  "/",
  requireAuth,
  requireRole("admin"),
  getAdminAppointments
);

export default router;