import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectMongoDB } from '../config/database.js';
import { ClientModel } from '../modules/rateLimiter/models/Client.model.js';
import { ConfigModel } from '../modules/rateLimiter/models/Config.model.js';
import { RequestLogModel } from '../modules/rateLimiter/models/RequestLog.model.js';
import { RateLimitStateModel } from '../modules/rateLimiter/models/RateLimitState.model.js';
import { generateApiKey } from '../modules/auth/auth.service.js';
import { getDefaultRateLimitConfig } from '../config/rateLimiter.config.js';

const DEMO_CLIENTS = [
  { username: 'mobile-app', clientId: 'user-101' },
  { username: 'payment-service', clientId: 'user-102' },
  { username: 'user-123', clientId: 'user-103' },
];

async function ensureAdmin() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  const apiKey = generateApiKey();
  const doc = await ClientModel.findOneAndUpdate(
    { username: 'admin' },
    {
      $setOnInsert: {
        username: 'admin',
        passwordHash,
        role: 'admin',
        clientId: 'admin-001',
        apiKey,
        status: 'active',
      },
    },
    { new: true, upsert: true },
  );
  return doc;
}

async function ensureClient({ username, clientId }) {
  const passwordHash = await bcrypt.hash('client123', 10);
  const apiKey = generateApiKey();
  return ClientModel.findOneAndUpdate(
    { username },
    {
      $setOnInsert: {
        username,
        passwordHash,
        role: 'client',
        clientId,
        apiKey,
        status: 'active',
      },
    },
    { new: true, upsert: true },
  );
}

async function ensureConfig() {
  const defaults = getDefaultRateLimitConfig();
  return ConfigModel.findOneAndUpdate(
    { key: 'global' },
    {
      $setOnInsert: {
        key: 'global',
        strategyType: 'FIXED_WINDOW',
        ...defaults,
      },
    },
    { new: true, upsert: true },
  );
}

async function run() {
  await connectMongoDB();
  // Clear stale per-process state (in-memory only — not persisted), but keep users & logs.
  // Also wipe logs/states for repeatable demo? Keep simple: do not nuke logs.
  await RateLimitStateModel.deleteMany({});

  const admin = await ensureAdmin();
  const config = await ensureConfig();
  const clients = [];
  for (const c of DEMO_CLIENTS) {
    clients.push(await ensureClient(c));
  }

  // eslint-disable-next-line no-console
  console.log('--- Seed complete ---');
  console.log('Active strategy:', config.strategyType);
  console.log('Admin:', { username: admin.username, password: 'admin123', apiKey: admin.apiKey });
  for (const c of clients) {
    console.log('Client:', {
      username: c.username,
      password: 'client123',
      clientId: c.clientId,
      apiKey: c.apiKey,
    });
  }
  console.log('Logs preserved:', await RequestLogModel.countDocuments());
  await mongoose.disconnect();
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Seed failed:', err);
  process.exit(1);
});
