// seed.js — resets the DB with users, symmetric friendships, and sample
// statuses (mixed privacy, some already viewed) so the UI is populated on boot.
// Run:  npm run seed
import mongoose from 'mongoose';
import { connectMongo } from './config/database.js';
import { UserModel } from './modules/user/user.model.js';
import { FriendshipModel } from './modules/friendship/friendship.model.js';
import { StatusModel } from './modules/status/status.model.js';
import { StatusViewModel } from './modules/view/view.model.js';
import { PRIVACY } from './core/constants/privacy.constants.js';
import { computeExpiry } from './core/utils/date.util.js';

const USERS = [
  { name: 'John Doe', avatar: '' },
  { name: 'Rahul Verma', avatar: '' },
  { name: 'Priya Shah', avatar: '' },
  { name: 'Amit Kumar', avatar: '' },
  { name: 'Neha Singh', avatar: '' },
  { name: 'Arjun Mehta', avatar: '' },
  { name: 'Karan Patel', avatar: '' },
  { name: 'Deepak Joshi', avatar: '' },
];

const BG = ['maroon', 'teal', 'indigo', 'sunset', 'forest', 'ocean', 'purple', 'slate'];
const minsAgo = (m) => new Date(Date.now() - m * 60 * 1000);

async function seed() {
  await connectMongo();
  await Promise.all([
    UserModel.deleteMany({}),
    FriendshipModel.deleteMany({}),
    StatusModel.deleteMany({}),
    StatusViewModel.deleteMany({}),
  ]);
  // Drop stale indexes from prior runs, then rebuild from schema.
  await Promise.all([
    StatusModel.syncIndexes(),
    StatusViewModel.syncIndexes(),
    FriendshipModel.syncIndexes(),
  ]);

  const users = await UserModel.insertMany(USERS);
  const id = Object.fromEntries(users.map((u) => [u.name, u._id]));
  console.log(`[seed] ${users.length} users`);

  // Everyone is friends with everyone (dense graph for a demo).
  const edges = [];
  for (const a of users) for (const b of users) if (String(a._id) !== String(b._id)) edges.push({ userId: a._id, friendId: b._id });
  await FriendshipModel.insertMany(edges);
  console.log(`[seed] ${edges.length} friendship edges`);

  // Sample statuses. createdAt varies so ordering is visible in the feed.
  const mk = (owner, text, bg, mins, extra = {}) => ({
    ownerId: id[owner],
    text,
    background: bg,
    privacy: PRIVACY.EVERYONE,
    includeUsers: [],
    excludeUsers: [],
    createdAt: minsAgo(mins),
    expiresAt: computeExpiry(minsAgo(mins)),
    ...extra,
  });

  const statuses = await StatusModel.insertMany([
    mk('Rahul Verma', 'Good morning everyone! ☀️', 'maroon', 5),
    mk('Rahul Verma', 'Work hard in silence. 💪', 'indigo', 3),
    mk('Priya Shah', 'Feeling productive today! ✨', 'purple', 20),
    mk('Amit Kumar', 'Weekend loading... 😎', 'ocean', 10),
    mk('Amit Kumar', 'Coffee first ☕', 'sunset', 8),
    mk('Amit Kumar', 'Big news coming soon 🚀', 'forest', 6),
    // Neha shares only with John + Priya (ONLY_SHARE_WITH demo)
    mk('Neha Singh', 'Close friends only 💚', 'teal', 60, {
      privacy: PRIVACY.ONLY_SHARE_WITH,
      includeUsers: [id['John Doe'], id['Priya Shah']],
    }),
    // Arjun hides from Karan (CONTACTS_EXCEPT demo)
    mk('Arjun Mehta', 'Not for everyone 🙈', 'slate', 120, {
      privacy: PRIVACY.CONTACTS_EXCEPT,
      excludeUsers: [id['Karan Patel']],
    }),
    // John's own statuses (for My Status screen)
    mk('John Doe', 'Building my WhatsApp Status MVP 🛠️', 'teal', 30),
    mk('John Doe', 'Learning LLD the right way 📚', 'indigo', 15),
  ]);
  console.log(`[seed] ${statuses.length} statuses`);

  // John (viewer) has already seen Neha's + Arjun's older statuses → they land
  // in the "Viewed updates" bucket, while Rahul/Priya/Amit stay unseen.
  const byText = Object.fromEntries(statuses.map((s) => [s.text, s._id]));
  await StatusViewModel.insertMany([
    { statusId: byText['Close friends only 💚'], viewerId: id['John Doe'], viewedAt: minsAgo(50) },
    { statusId: byText['Not for everyone 🙈'], viewerId: id['John Doe'], viewedAt: minsAgo(110) },
  ]);

  // A few viewers on John's status so the Viewers list is populated.
  await StatusViewModel.insertMany([
    { statusId: byText['Building my WhatsApp Status MVP 🛠️'], viewerId: id['Rahul Verma'], viewedAt: minsAgo(20) },
    { statusId: byText['Building my WhatsApp Status MVP 🛠️'], viewerId: id['Priya Shah'], viewedAt: minsAgo(18) },
    { statusId: byText['Building my WhatsApp Status MVP 🛠️'], viewerId: id['Amit Kumar'], viewedAt: minsAgo(12) },
  ]);
  console.log('[seed] sample views recorded');

  console.log('\n[seed] done. Log in as "John Doe" to see the richest demo state.');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(async (err) => {
  console.error('[seed] failed:', err);
  await mongoose.disconnect();
  process.exit(1);
});
