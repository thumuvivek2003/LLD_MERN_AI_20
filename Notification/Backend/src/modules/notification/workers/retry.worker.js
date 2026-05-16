import { getQueueInstance } from '../../../shared/queue/queueManager.js';
import { notificationRepository } from '../repositories/notification.repository.js';
import { retryService } from '../services/retry.service.js';
import { RETRY } from '../../../constants/retry.constants.js';
import { logger } from '../../../shared/logger/logger.js';
import { NOTIFICATION_STATUS } from '../../../constants/notificationStatus.constants.js';

let started = false;
let timer = null;

/**
 * Retry worker:
 *   1. Drains any retry jobs whose scheduledAt is past (moves them onto the
 *      main queue so the notification worker picks them up).
 *   2. Auto-schedules retries for FAILED notifications that haven't yet
 *      hit MAX_ATTEMPTS and aren't already scheduled.
 */
export async function processRetryNotification() {
  const queue = getQueueInstance();
  queue.drainDueRetries();

  const failed = await notificationRepository.findFailedNotifications(20);
  for (const n of failed) {
    if (n.status !== NOTIFICATION_STATUS.FAILED) continue;
    if ((n.retryCount || 0) >= RETRY.MAX_ATTEMPTS) continue;
    try {
      await retryService.retryFailedNotification(n._id);
    } catch (err) {
      logger.warn('worker.retry.schedule.failed', {
        notificationId: n._id,
        err: err.message,
      });
    }
  }
}

export function startRetryWorker() {
  if (started) return;
  started = true;
  const queue = getQueueInstance();
  queue.registerWorker();

  timer = setInterval(() => {
    processRetryNotification().catch((err) =>
      logger.error('worker.retry.poll.failed', { err: err.message }),
    );
  }, 2_000);
  timer.unref?.();

  logger.info('worker.retry.started');
}

export function stopRetryWorker() {
  if (timer) clearInterval(timer);
  started = false;
}
