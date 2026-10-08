import { Router } from "express";

import {
  bookAppointment,
  getAppointments,
  cancelUserAppointment,
  completeUserAppointment,
} from "../controllers/appointment.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  requireRole("patient"),
  bookAppointment
);

router.get(
  "/",
  requireAuth,
  requireRole("patient", "doctor"),
  getAppointments
);

router.patch(
  "/:id/cancel",
  requireAuth,
  requireRole("patient"),
  cancelUserAppointment
);

router.patch(
  "/:id/complete",
  requireAuth,
  requireRole("doctor"),
  completeUserAppointment
);
export default router;