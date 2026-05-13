import mongoose from 'mongoose';
import { env } from './env.config.js';
import { logger } from '../core/utils/logger.util.js';

let connected = false;

export async function connectDatabase() {
  if (connected) return mongoose.connection;
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri);
  connected = true;
  logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  return mongoose.connection;
}
