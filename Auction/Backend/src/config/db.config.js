import mongoose from 'mongoose';
import { loadEnv } from './env.config.js';
import { logInfo, logError } from '../shared/utils/logger.util.js';

export async function connectDB() {
  const { mongoUri } = loadEnv();
  try {
    await mongoose.connect(mongoUri);
    logInfo(`MongoDB connected: ${mongoUri}`);
  } catch (err) {
    logError('MongoDB connection failed', err);
    throw err;
  }
}
