import mongoose from 'mongoose';
import { env } from './env.config.js';
import { createLogger } from './logger.config.js';

const logger = createLogger();
let instance = null;

export const connectDatabase = async () => {
  if (instance) return instance;
  mongoose.set('strictQuery', true);
  instance = await mongoose.connect(env.mongoUri);
  logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  return instance;
};

export const getDatabaseInstance = () => instance;
