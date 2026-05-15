import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../shared/utils/logger.js";

export async function connectMongoDB() {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info(`MongoDB connected: ${env.MONGO_URI}`);
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`);
    throw err;
  }
}
