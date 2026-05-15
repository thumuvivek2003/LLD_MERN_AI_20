import dotenv from "dotenv";

dotenv.config();

export function loadEnvConfig() {
  return {
    port: Number(process.env.PORT || 5000),
    mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/splitwise_mvp",
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  };
}

export const env = loadEnvConfig();
