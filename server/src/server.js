import "dotenv/config";
import app from "./app.js";
import pool from "./config/db.js";
const requiredEnv = [
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "MEDICAL_RECORD_ENCRYPTION_KEY",
];

for (const name of requiredEnv) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
   await pool.query("SELECT NOW()");
console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`MediSphere API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();