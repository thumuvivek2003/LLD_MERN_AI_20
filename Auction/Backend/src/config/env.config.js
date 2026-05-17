import dotenv from 'dotenv';

let cached = null;

export function loadEnv() {
  if (cached) return cached;
  dotenv.config();
  cached = {
    port: Number(process.env.PORT || 5001),
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/auction_mvp',
    jwtSecret: process.env.JWT_SECRET || 'change_me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    nodeEnv: process.env.NODE_ENV || 'development',
  };
  return cached;
}
