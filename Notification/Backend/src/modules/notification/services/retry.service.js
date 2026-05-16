import { calculateExponentialBackoff } from '../../../shared/utils/retry.util.js';
import { RETRY } from '../../../constants/retry.constants.js';
import { notificationRepository } from '../repositories/notification.repository.js';
import { notificationStatusService } from './notificationStatus.service.js';
import { getQueueInstance } from '../../../shared/queue/queueManager.js';
import { generateId } from '../../../shared/utils/id.util.js';
import { notificationPublisher } from '../events/notification.publisher.js';
import { NOTIFICATION_EVENTS } from '../events/notification.events.js';
import { NotificationNotFoundException, InvalidNotificationStateException } from '../../../shared/exceptions/notification.exception.js';
import { NOTIFICATION_STATUS } from '../../../constants/notificationStatus.constants.js';

export const retryService = {
  calculateRetryDelay(attempt) {
    return calculateExponentialBackoff(attempt, RETRY.BASE_DELAY_MS);
  },

  /**
   * Schedule a retry by re-incrementing the counter and pushing onto the
   * delayed queue. Called by the retry.worker.js (auto retry) and by the
   * controller (manual retry).
   */
  async retryFailedNotification(id, { manual = false } = {}) {
    const current = await notificationRepository.findById(id);
    if (!current) throw new NotificationNotFoundException(id);
    if (![NOTIFICATION_STATUS.FAILED, NOTIFICATION_STATUS.DEAD].includes(current.status)) {
      throw new InvalidNotificationStateException(
        `Notification ${id} is not retryable (status=${current.status})`,
      );
    }
    const incremented = await notificationRepository.incrementRetryCount(id);
    await notificationStatusService.markRetrying(id);

    const nextAttempt = incremented.retryCount;
    const delay = manual ? 0 : this.calculateRetryDelay(nextAttempt);

    const queue = getQueueInstance();
    const job = {
      id: generateId('job'),
      notificationId: id,
      attempt: nextAttempt,
      type: 'retry',
    };

    if (delay > 0) queue.enqueueDelayed(job, delay);
    else queue.enqueue(job);

    notificationPublisher.publish(NOTIFICATION_EVENTS.RETRY_SCHEDULED, {
      notificationId: id,
      attempt: nextAttempt,
      delayMs: delay,
      manual,
    });

    return { ...incremented, delayMs: delay };
  },
};
