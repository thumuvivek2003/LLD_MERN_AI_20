import dotenv from "dotenv";

dotenv.config();

export function loadEnvConfig() {
  return {
    PORT: parseInt(process.env.PORT || "4000", 10),
    MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/elevator",
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    TICK_INTERVAL_MS: parseInt(process.env.TICK_INTERVAL_MS || "1000", 10),
    TOTAL_FLOORS: parseInt(process.env.TOTAL_FLOORS || "11", 10),
    TOTAL_ELEVATORS: parseInt(process.env.TOTAL_ELEVATORS || "4", 10),
  };
}

export const env = loadEnvConfig();
