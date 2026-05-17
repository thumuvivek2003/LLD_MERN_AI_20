import cron from 'node-cron';
import { auctionScheduler } from '../modules/auction/services/auctionScheduler.service.js';
import { logError, logInfo } from '../shared/utils/logger.util.js';

// Every 5 seconds: flip SCHEDULED->OPEN and OPEN->CLOSED as time hits.
export function startAuctionScheduler() {
  const task = cron.schedule('*/5 * * * * *', async () => {
    try {
      await auctionScheduler.autoStartAuction();
      await auctionScheduler.autoCloseAuction();
    } catch (err) {
      logError('Scheduler tick failed', err);
    }
  });
  logInfo('Auction scheduler running (every 5s)');
  return task;
}

export const closeAuctionScheduler = (task) => task?.stop();
