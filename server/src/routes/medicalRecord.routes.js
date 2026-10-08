import { Router } from "express";

import {
  createRecord,
  getMyMedicalRecords,
  getDoctorRecords,
  updateRecord,
} from "../controllers/medicalRecord.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { medicalRecordMutationLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  requireRole("doctor"),
  createRecord
);

router.get(
  "/",
  requireAuth,
  requireRole("patient"),
  getMyMedicalRecords
);

router.get(
  "/doctor",
  requireAuth,
  requireRole("doctor"),
  getDoctorRecords
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("doctor"),
  updateRecord
);

export default router;