import dotenv from 'dotenv';

let loaded = false;

/**
 * Load .env once and expose typed config object.
 */
export function loadEnv() {
  if (!loaded) {
    dotenv.config();
    loaded = true;
  }
  return {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/chat_mvp',
    jwtSecret: process.env.JWT_SECRET || 'dev_super_secret_change_me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    devFixedOtp: process.env.DEV_FIXED_OTP || '123456',
  };
}

export const env = loadEnv();
