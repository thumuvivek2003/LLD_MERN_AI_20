/**
 * Canonical event names. Centralising these prevents typo bugs across
 * publisher/observers.
 */
export const NOTIFICATION_EVENTS = Object.freeze({
  TRIGGERED: 'notification.triggered',
  QUEUED: 'notification.queued',
  SENT: 'notification.sent',
  FAILED: 'notification.failed',
  RETRY_SCHEDULED: 'notification.retry-scheduled',
  DEAD: 'notification.dead',
});
