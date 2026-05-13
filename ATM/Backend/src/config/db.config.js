import mongoose from "mongoose";
import { env } from "./env.config.js";

export async function connectDatabase() {
  await mongoose.connect(env.mongoUri);
  console.log(`[db] connected: ${env.mongoUri}`);
  return mongoose.connection;
}
