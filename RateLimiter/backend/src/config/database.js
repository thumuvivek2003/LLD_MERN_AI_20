import mongoose from 'mongoose';
import { loadEnvConfig } from './env.js';

export async function connectMongoDB() {
  const { mongoUri } = loadEnvConfig();
  await mongoose.connect(mongoUri);
  return mongoose.connection;
}
