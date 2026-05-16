import dotenv from 'dotenv';

dotenv.config();

let cached = null;

export function loadAppConfig() {
  if (cached) return cached;
  cached = {
    port: parseInt(process.env.PORT || '5001', 10),
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/notification_system',
    clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    logLevel: process.env.LOG_LEVEL || 'info',
    nodeEnv: process.env.NODE_ENV || 'development',
  };
  return cached;
}
