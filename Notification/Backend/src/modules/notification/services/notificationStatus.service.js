import { notificationRepository } from '../repositories/notification.repository.js';
import { queuedState } from '../state/queued.state.js';
import { sendingState } from '../state/sending.state.js';
import { sentState } from '../state/sent.state.js';
import { failedState, retryingState, deadState } from '../state/failed.state.js';
import { NotificationNotFoundException } from '../../../shared/exceptions/notification.exception.js';
import { NOTIFICATION_STATUS } from '../../../constants/notificationStatus.constants.js';

/**
 * Status service — every status transition goes through here so the State
 * pattern owns the legal moves and we keep a uniform attempt log.
 */
async function transition(id, stateObj, { error = null } = {}) {
  const current = await notificationRepository.findById(id);
  if (!current) throw new NotificationNotFoundException(id);

  const nextStatus = stateObj.handle(current.status);

  const attempt = {
    at: new Date(),
    status: nextStatus,
    error,
  };

  const extra = { lastError: error || null };
  await notificationRepository.pushAttempt(id, attempt);
  return notificationRepository.updateStatus(id, nextStatus, extra);
}

export const notificationStatusService = {
  markQueued(id) {
    return transition(id, queuedState);
  },
  markSending(id) {
    return transition(id, sendingState);
  },
  markSent(id) {
    return transition(id, sentState);
  },
  markFailed(id, error) {
    return transition(id, failedState, { error });
  },
  markRetrying(id) {
    return transition(id, retryingState);
  },
  markDead(id, error) {
    return transition(id, deadState, { error });
  },
  /** Convenience used by the worker — picks the right state by retry count. */
  async resolveFailureNext(id, error, maxAttempts) {
    const current = await notificationRepository.findById(id);
    if (!current) throw new NotificationNotFoundException(id);
    if ((current.retryCount || 0) >= maxAttempts) {
      const dead = await transition(id, deadState, { error });
      return { status: NOTIFICATION_STATUS.DEAD, notification: dead };
    }
    const failed = await transition(id, failedState, { error });
    return { status: NOTIFICATION_STATUS.FAILED, notification: failed };
  },
};
