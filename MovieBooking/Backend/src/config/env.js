import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  seatLockMinutes: parseInt(process.env.SEAT_LOCK_MINUTES || '10'),
  nodeEnv: process.env.NODE_ENV || 'development',
};
