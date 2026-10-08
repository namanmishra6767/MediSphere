import { Router } from "express";

import { getAuditLogs } from "../controllers/audit.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.get(
  "/",
  requireAuth,
  requireRole("admin"),
  getAuditLogs
);

export default router;