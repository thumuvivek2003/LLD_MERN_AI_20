import mongoose from "mongoose";
import { env } from "../../config/env.config.js";

let instance = null;

export async function getMongoInstance() {
  if (instance) return instance;
  await mongoose.connect(env.mongoUri);
  instance = mongoose.connection;
  console.log(`[mongo.singleton] connected: ${env.mongoUri}`);
  return instance;
}

export async function closeMongoConnection() {
  if (!instance) return;
  await mongoose.disconnect();
  instance = null;
  console.log("[mongo.singleton] disconnected");
}
