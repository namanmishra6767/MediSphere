import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const authLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  keyGenerator: (req) => {
    const email = req.body?.email?.trim().toLowerCase() || "unknown";
    return `${ipKeyGenerator(req.ip)}:${email}`;
  },

  message: {
    message: "Too many login attempts. Please try again later.",
  },
});

export const medicalRecordMutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many medical record requests. Please try again later.",
  },
});