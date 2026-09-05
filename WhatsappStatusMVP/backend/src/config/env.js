// config/env.js — loadEnvironment() [Singleton]
// Loads .env once and exposes a frozen, validated config object to the whole app.
import dotenv from 'dotenv';

dotenv.config();

let instance = null;

function loadEnvironment() {
  if (instance) return instance;

  instance = Object.freeze({
    port: Number(process.env.PORT || 4002),
    mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/whatsapp_status_mvp',
    clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    statusTtlHours: 24,
  });

  return instance;
}

export const env = loadEnvironment();
