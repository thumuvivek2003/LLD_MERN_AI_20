import dotenv from 'dotenv';

dotenv.config();

export const loadEnvConfig = () => ({
  port: Number(process.env.PORT) || 5001,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'dev_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
});

export const env = loadEnvConfig();
