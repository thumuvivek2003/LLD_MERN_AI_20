import mongoose from 'mongoose';
import { loadAppConfig } from './app.config.js';
import { logger } from '../shared/logger/logger.js';

export async function connectDatabase() {
  const { mongoUri } = loadAppConfig();
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri);
  logger.info('mongo.connected', { uri: mongoUri });
  return mongoose.connection;
}
