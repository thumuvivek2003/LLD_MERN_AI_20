import dotenv from 'dotenv';

dotenv.config();

export const getConfig = () => ({
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/library',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiry: process.env.JWT_EXPIRY || '7d',
  reservationExpiryHours: parseInt(process.env.RESERVATION_EXPIRY_HOURS) || 24,
  borrowDurationDays: parseInt(process.env.BORROW_DURATION_DAYS) || 14,
  finePerDay: parseFloat(process.env.FINE_PER_DAY) || 5
});