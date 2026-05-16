/**
 * Seed script — wipes & re-fills users, templates, and a few sample notifications
 * so the admin dashboard isn't empty on first run.
 *
 *   npm run seed
 */
import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.config.js';
import { UserModel } from '../modules/user/models/user.model.js';
import { TemplateModel } from '../modules/template/models/template.model.js';
import { NotificationModel } from '../modules/notification/models/notification.model.js';
import { logger } from '../shared/logger/logger.js';

const USERS = [
  {
    _id: 'u_admin',
    name: 'Admin',
    email: 'admin@notify.dev',
    phone: '+910000000000',
    pushToken: 'tok_admin',
    role: 'ADMIN',
    preferences: { emailEnabled: true, smsEnabled: true, pushEnabled: true },
  },
  {
    _id: 'u1',
    name: 'Vivek',
    email: 'vivek@notify.dev',
    phone: '+919999900001',
    pushToken: 'tok_u1',
    role: 'USER',
    preferences: { emailEnabled: true, smsEnabled: true, pushEnabled: true },
  },
  {
    _id: 'u2',
    name: 'Rahul',
    email: 'rahul@notify.dev',
    phone: '+919999900002',
    pushToken: 'tok_u2',
    role: 'USER',
    preferences: { emailEnabled: true, smsEnabled: false, pushEnabled: true },
  },
  {
    _id: 'u3',
    name: 'Sneha',
    email: 'sneha@notify.dev',
    phone: '+919999900003',
    pushToken: 'tok_u3',
    role: 'USER',
    preferences: { emailEnabled: false, smsEnabled: true, pushEnabled: true },
  },
];

const TEMPLATES = [
  {
    _id: 't_payment_email',
    name: 'Payment Success — Email',
    eventType: 'PAYMENT_SUCCESS',
    channel: 'EMAIL',
    activeVersion: 1,
    versions: [
      {
        version: 1,
        subjectTemplate: 'Payment Received',
        bodyTemplate: 'Hi {{name}}, your payment of ₹{{amount}} was successful.',
        isActive: true,
        createdAt: new Date(),
      },
    ],
  },
  {
    _id: 't_ride_completed_sms',
    name: 'Ride Completed — SMS',
    eventType: 'RIDE_COMPLETED',
    channel: 'SMS',
    activeVersion: 1,
    versions: [
      {
        version: 1,
        subjectTemplate: '',
        bodyTemplate: 'Hi {{name}}, your ride to {{destination}} is complete. Fare ₹{{fare}}.',
        isActive: true,
        createdAt: new Date(),
      },
    ],
  },
  {
    _id: 't_order_created_push',
    name: 'Order Created — Push',
    eventType: 'ORDER_CREATED',
    channel: 'PUSH',
    activeVersion: 1,
    versions: [
      {
        version: 1,
        subjectTemplate: 'Order #{{orderId}} placed',
        bodyTemplate: 'Hi {{name}}, your order will arrive by {{eta}}.',
        isActive: true,
        createdAt: new Date(),
      },
    ],
  },
  {
    _id: 't_ride_booked_email',
    name: 'Ride Booked — Email',
    eventType: 'RIDE_BOOKED',
    channel: 'EMAIL',
    activeVersion: 1,
    versions: [
      {
        version: 1,
        subjectTemplate: 'Your ride is booked',
        bodyTemplate: 'Hi {{name}}, your ride with {{driverName}} is on the way. ETA {{eta}} mins.',
        isActive: true,
        createdAt: new Date(),
      },
    ],
  },
];

function n(overrides) {
  const id = `n_${Math.random().toString(36).slice(2, 10)}`;
  return {
    _id: id,
    userId: 'u1',
    eventId: null,
    eventType: 'PAYMENT_SUCCESS',
    channel: 'EMAIL',
    templateId: 't_payment_email',
    templateVersion: 1,
    payloadSnapshot: { name: 'Vivek', amount: 500 },
    status: 'QUEUED',
    retryCount: 0,
    attempts: [{ at: new Date(), status: 'QUEUED' }],
    ...overrides,
  };
}

const NOTIFICATIONS = [
  n({ status: 'SENT', attempts: [{ at: new Date(), status: 'QUEUED' }, { at: new Date(), status: 'SENDING' }, { at: new Date(), status: 'SENT' }] }),
  n({
    status: 'SENT',
    channel: 'SMS',
    templateId: 't_ride_completed_sms',
    templateVersion: 1,
    eventType: 'RIDE_COMPLETED',
    payloadSnapshot: { name: 'Vivek', destination: 'Airport', fare: 320 },
  }),
  n({
    status: 'FAILED',
    retryCount: 1,
    channel: 'EMAIL',
    userId: 'u2',
    payloadSnapshot: { name: 'Rahul', amount: 1200 },
    attempts: [
      { at: new Date(), status: 'QUEUED' },
      { at: new Date(), status: 'SENDING' },
      { at: new Date(), status: 'FAILED', error: 'simulated_email_failure' },
    ],
    lastError: 'simulated_email_failure',
  }),
  n({
    status: 'RETRYING',
    retryCount: 2,
    channel: 'PUSH',
    userId: 'u3',
    eventType: 'ORDER_CREATED',
    templateId: 't_order_created_push',
    templateVersion: 1,
    payloadSnapshot: { name: 'Sneha', orderId: 'ORD123', eta: '5pm' },
  }),
  n({
    status: 'DEAD',
    retryCount: 3,
    channel: 'SMS',
    userId: 'u2',
    eventType: 'RIDE_COMPLETED',
    templateId: 't_ride_completed_sms',
    templateVersion: 1,
    payloadSnapshot: { name: 'Rahul', destination: 'Office', fare: 180 },
    attempts: [
      { at: new Date(), status: 'QUEUED' },
      { at: new Date(), status: 'SENDING' },
      { at: new Date(), status: 'FAILED', error: 'simulated_sms_failure' },
      { at: new Date(), status: 'RETRYING' },
      { at: new Date(), status: 'SENDING' },
      { at: new Date(), status: 'DEAD', error: 'simulated_sms_failure' },
    ],
    lastError: 'simulated_sms_failure',
  }),
  n({
    status: 'QUEUED',
    channel: 'EMAIL',
    userId: 'u1',
    eventType: 'RIDE_BOOKED',
    templateId: 't_ride_booked_email',
    templateVersion: 1,
    payloadSnapshot: { name: 'Vivek', driverName: 'Arun', eta: 6 },
  }),
];

async function run() {
  try {
    await connectDatabase();

    logger.info('seed.start');

    await Promise.all([
      UserModel.deleteMany({}),
      TemplateModel.deleteMany({}),
      NotificationModel.deleteMany({}),
    ]);

    await UserModel.insertMany(USERS);
    await TemplateModel.insertMany(TEMPLATES);
    await NotificationModel.insertMany(NOTIFICATIONS);

    logger.info('seed.done', {
      users: USERS.length,
      templates: TEMPLATES.length,
      notifications: NOTIFICATIONS.length,
    });
  } catch (err) {
    logger.error('seed.failed', { err: err.message, stack: err.stack });
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

run();
