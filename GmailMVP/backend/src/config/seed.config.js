import mongoose from 'mongoose';
import { User } from '../modules/user/user.model.js';
import { Mail } from '../modules/mail/mail.model.js';
import { Thread } from '../modules/thread/thread.model.js';
import { MAIL_STATUS } from '../shared/constants/mail-status.constant.js';

/** Seed users (must match the API contract / screens.png). */
const SEED_USERS = [
  { key: 'alice', name: 'Alice Johnson', email: 'alice@example.com', avatarColor: '#6366f1' },
  { key: 'bob', name: 'Bob Smith', email: 'bob@example.com', avatarColor: '#10b981' },
  { key: 'charlie', name: 'Charlie Brown', email: 'charlie@example.com', avatarColor: '#f59e0b' },
  { key: 'david', name: 'David Miller', email: 'david@example.com', avatarColor: '#ef4444' },
  { key: 'emma', name: 'Emma Williams', email: 'emma@example.com', avatarColor: '#8b5cf6' },
];

/** Sample conversations to make inbox/sent non-empty on first load. */
const SEED_CONVERSATIONS = [
  {
    from: 'alice',
    to: ['bob'],
    subject: 'Welcome to the team!',
    body: 'Hi Bob, welcome aboard! Let me know if you need anything to get started. Looking forward to working with you.',
    replies: [
      { from: 'bob', body: 'Thanks Alice! Excited to be here. I will set up my environment today.' },
    ],
  },
  {
    from: 'charlie',
    to: ['alice', 'david'],
    subject: 'Project Kickoff Meeting',
    body: 'Hi all, let us schedule the project kickoff for Thursday at 10am. Please confirm your availability.',
    replies: [
      { from: 'alice', body: 'Thursday 10am works for me. I will prepare the roadmap slides.' },
    ],
  },
  {
    from: 'bob',
    to: ['alice'],
    subject: 'Lunch plans?',
    body: 'Are you free for lunch tomorrow? Thinking about trying the new place downtown.',
    replies: [],
  },
  {
    from: 'emma',
    to: ['alice'],
    subject: 'Design review feedback',
    body: 'I left some comments on the latest mockups. Overall looks great, just a few spacing tweaks on the inbox view.',
    replies: [],
  },
  {
    from: 'alice',
    to: ['bob', 'charlie', 'david'],
    subject: 'Quarterly report draft',
    body: 'Please find the draft of the quarterly report. Review sections 2 and 3 and send edits by Friday.',
    replies: [
      { from: 'david', body: 'Reviewed section 3 — looks solid. Minor comment on the revenue chart.' },
    ],
  },
];

/**
 * Seed the database with users + sample mails/threads if it's empty.
 * Idempotent: if users already exist, does nothing.
 * @returns {Promise<{seeded:boolean, users:number, mails:number, threads:number}>}
 */
export async function seedDatabase() {
  const existingUsers = await User.estimatedDocumentCount();
  if (existingUsers > 0) {
    console.log('[seed] users already present — skipping seed');
    return { seeded: false, users: existingUsers, mails: 0, threads: 0 };
  }

  console.log('[seed] empty database detected — seeding...');

  // 1) Users
  const createdUsers = await User.insertMany(
    SEED_USERS.map(({ key, ...rest }) => rest)
  );
  const byKey = {};
  SEED_USERS.forEach((u, i) => {
    byKey[u.key] = createdUsers[i];
  });

  // 2) Conversations (threads + mails), directly persisted.
  let mailCount = 0;
  let threadCount = 0;
  let clock = Date.now() - SEED_CONVERSATIONS.length * 60 * 60 * 1000; // stagger back in time

  for (const convo of SEED_CONVERSATIONS) {
    const threadId = new mongoose.Types.ObjectId();
    const sender = byKey[convo.from];
    const receivers = convo.to.map((k) => byKey[k]);

    const participantIds = new Set([
      String(sender._id),
      ...receivers.map((r) => String(r._id)),
    ]);
    const mailIds = [];

    // Root mail
    clock += 30 * 60 * 1000;
    const root = await Mail.create({
      threadId,
      sender: sender._id,
      receivers: receivers.map((r) => r._id),
      subject: convo.subject,
      body: convo.body,
      timestamp: new Date(clock),
      status: MAIL_STATUS.SENT,
      readBy: [sender._id],
    });
    mailIds.push(root._id);
    mailCount += 1;

    // Replies (reuse thread + Re: subject; recipients = everyone minus replier)
    for (const reply of convo.replies) {
      const replier = byKey[reply.from];
      const replyReceivers = [...participantIds].filter(
        (id) => id !== String(replier._id)
      );
      participantIds.add(String(replier._id));

      clock += 45 * 60 * 1000;
      const subject = /^re:/i.test(convo.subject) ? convo.subject : `Re: ${convo.subject}`;
      const replyMail = await Mail.create({
        threadId,
        sender: replier._id,
        receivers: replyReceivers,
        subject,
        body: reply.body,
        timestamp: new Date(clock),
        status: MAIL_STATUS.SENT,
        readBy: [replier._id],
      });
      mailIds.push(replyMail._id);
      mailCount += 1;
    }

    await Thread.create({
      _id: threadId,
      subject: convo.subject,
      mailIds,
      participants: [...participantIds],
    });
    threadCount += 1;
  }

  console.log(
    `[seed] done — ${createdUsers.length} users, ${threadCount} threads, ${mailCount} mails`
  );
  return {
    seeded: true,
    users: createdUsers.length,
    mails: mailCount,
    threads: threadCount,
  };
}
