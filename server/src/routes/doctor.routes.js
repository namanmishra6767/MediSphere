import express from "express";
import { getDoctors, getPatientsForDoctor } from "../controllers/doctor.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, getDoctors);

router.get(
  "/patients",
  requireAuth,
  getPatientsForDoctor
);

export default router;