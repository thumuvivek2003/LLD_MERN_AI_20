import dotenv from 'dotenv';

dotenv.config();

/**
 * Load & validate environment configuration.
 * @returns {{port:number, mongoUri:string, clientOrigin:string, nodeEnv:string}}
 */
export function loadEnv() {
  return {
    port: Number(process.env.PORT) || 4000,
    mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gmail_mvp',
    clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    nodeEnv: process.env.NODE_ENV || 'development',
  };
}

export const env = loadEnv();
export default env;
