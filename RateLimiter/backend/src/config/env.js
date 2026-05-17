import dotenv from 'dotenv';

let cached = null;

export function loadEnvConfig() {
  if (cached) return cached;
  dotenv.config();
  cached = {
    port: parseInt(process.env.PORT || '4000', 10),
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/rate_limiter',
    jwtSecret: process.env.JWT_SECRET || 'replace_me_in_dev',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  };
  return cached;
}
