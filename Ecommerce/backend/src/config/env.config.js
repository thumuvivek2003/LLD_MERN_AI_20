import dotenv from 'dotenv';

export function loadEnv() {
  dotenv.config();
  return {
    PORT: Number(process.env.PORT) || 5001,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce_mvp',
    JWT_SECRET: process.env.JWT_SECRET || 'changeme_dev_secret',
  };
}

export const env = loadEnv();
export const { PORT, MONGO_URI, JWT_SECRET } = env;
