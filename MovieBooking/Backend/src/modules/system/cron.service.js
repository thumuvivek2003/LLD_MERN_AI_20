import cron from 'node-cron';
import { releaseExpiredSeatLocks } from './lockCleanup.service.js';

export const startCronJobs = () => {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    await releaseExpiredSeatLocks();
  });
  console.log('Cron jobs started');
};
