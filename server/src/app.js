import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import medicalRecordRoutes from "./routes/medicalRecord.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import adminAppointmentRoutes from "./routes/adminAppointment.routes.js";
import { authLoginLimiter } from "./middleware/rateLimit.middleware.js";
import { verifyRequestOrigin } from "./middleware/origin.middleware.js";

const app = express();

app.use(helmet());

const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(verifyRequestOrigin);
app.use("/api/auth/login", authLoginLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/appointments", adminAppointmentRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "MediSphere API is running",
  });
});

export default app;