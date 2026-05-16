import { getQueueInstance } from '../../../shared/queue/queueManager.js';
import { notificationService } from '../services/notification.service.js';
import { logger } from '../../../shared/logger/logger.js';

let started = false;
let timer = null;

/**
 * Pull jobs off the in-memory queue and run them through the notification
 * service. The worker is intentionally lightweight — it loops every 500ms.
 */
export async function processQueuedNotification() {
  const queue = getQueueInstance();
  let job;
  // Drain whatever's currently available without blocking the event loop too long
  while ((job = queue.dequeue())) {
    try {
      await notificationService.processNotification(job);
    } catch (err) {
      logger.error('worker.notification.unhandled', { jobId: job.id, err: err.message });
    }
  }
}

export function startNotificationWorker() {
  if (started) return;
  started = true;
  const queue = getQueueInstance();
  queue.registerWorker();

  // React immediately when a job arrives (Observer)
  queue.on('job:enqueued', () => {
    processQueuedNotification().catch((err) =>
      logger.error('worker.notification.react.failed', { err: err.message }),
    );
  });

  // Safety-net polling — handles delayed jobs drained later by retry worker
  timer = setInterval(() => {
    processQueuedNotification().catch((err) =>
      logger.error('worker.notification.poll.failed', { err: err.message }),
    );
  }, 500);
  timer.unref?.();

  logger.info('worker.notification.started');
}

export function stopNotificationWorker() {
  if (timer) clearInterval(timer);
  started = false;
}
