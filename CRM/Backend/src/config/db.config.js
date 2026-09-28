import mongoose from 'mongoose';
import { env } from './env.config.js';
import { logger } from '../core/utils/logger.util.js';

let connected = false;

export async function connectDatabase(uri = env.mongoUri) {
  if (connected) return mongoose.connection;
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  connected = true;
  logger.info(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  return mongoose.connection;
}

export async function disconnectDatabase() {
  if (!connected) return;
  await mongoose.disconnect();
  connected = false;
}

export const dbConnection = () => mongoose.connection;
