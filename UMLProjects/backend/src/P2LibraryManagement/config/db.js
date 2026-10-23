import mongoose from 'mongoose';
import { getConfig } from './env.js';

export const connectDB = async () => {
  try {
    const config = getConfig();
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error('MongoDB Disconnection Error:', error);
  }
};