import mongoose from 'mongoose';
import { env } from './env.config.js';
import { logger } from '../shared/logger/logger.js';

/**
 * Connect to MongoDB. Logs a friendly warning if it fails so the
 * server can still boot for inspection.
 */
export async function connectMongo() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.mongoUri);
    logger.info(`MongoDB connected: ${env.mongoUri}`);
    return mongoose.connection;
  } catch (err) {
    logger.warn(`MongoDB connection failed: ${err.message}. Server will still start.`);
    return null;
  }
}
