import dotenv from "dotenv";

dotenv.config();

export function loadEnvConfig() {
  return {
    port: Number(process.env.PORT || 5001),
    mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/atm_mvp",
    sessionTimeoutMs: Number(process.env.SESSION_TIMEOUT_MS || 60000),
    maxPinAttempts: Number(process.env.MAX_PIN_ATTEMPTS || 3),
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  };
}

export const env = loadEnvConfig();
