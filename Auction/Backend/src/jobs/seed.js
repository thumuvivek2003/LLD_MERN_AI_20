import bcrypt from 'bcryptjs';
import { UserModel } from '../modules/auth/models/user.model.js';
import { ROLES } from '../shared/constants/roles.constant.js';
import { logInfo } from '../shared/utils/logger.util.js';

const SEED_USERS = [
  { name: 'Admin', email: 'admin@auction.com', password: 'Admin@123', role: ROLES.ADMIN, walletBalance: 0 },
  { name: 'Alice', email: 'alice@auction.com', password: 'Member@123', role: ROLES.MEMBER, walletBalance: 50010 },
  { name: 'Bob', email: 'bob@auction.com', password: 'Member@123', role: ROLES.MEMBER, walletBalance: 50010 },
  { name: 'Eve', email: 'eve@auction.com', password: 'Specta@123', role: ROLES.SPECTATOR, walletBalance: 0 },
];

export async function seedIfEmpty() {
  const count = await UserModel.countDocuments();
  if (count > 0) {
    logInfo(`Seed skipped — ${count} users already present`);
    return;
  }
  const docs = await Promise.all(
    SEED_USERS.map(async (u) => ({
      ...u,
      password: await bcrypt.hash(u.password, 10),
    })),
  );
  await UserModel.insertMany(docs);
  logInfo(`Seeded ${docs.length} users (admin/alice/bob/eve)`);
}

// allow `npm run seed`
if (import.meta.url === `file://${process.argv[1]}`) {
  const { connectDB } = await import('../config/db.config.js');
  await connectDB();
  await seedIfEmpty();
  process.exit(0);
}
