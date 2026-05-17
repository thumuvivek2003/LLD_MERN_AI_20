import { subscribe } from '../event-bus.js';
import { EVENTS } from '../event.constants.js';
import socketManager from '../../modules/socket/socket.manager.js';
import { markDelivered } from '../../modules/delivery/delivery.service.js';
import { logger } from '../../shared/logger/logger.js';

/**
 * When a message is created, immediately mark DELIVERED for any recipient
 * who is currently online (their socket is connected). The delivery
 * service publishes MESSAGE_DELIVERED itself, so socket subscriber emits.
 */
export function handle({ memberIds, senderId, message }) {
  const onlineRecipients = (memberIds || []).filter(
    (uid) => String(uid) !== String(senderId) && socketManager.isOnline(uid)
  );
  for (const uid of onlineRecipients) {
    markDelivered({ messageId: message._id, userId: uid }).catch((err) => {
      logger.warn('auto-mark-delivered failed:', err?.message);
    });
  }
}

export function register() {
  subscribe(EVENTS.MESSAGE_CREATED, handle);
}
