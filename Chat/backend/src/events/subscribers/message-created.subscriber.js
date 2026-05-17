import { subscribe } from '../event-bus.js';
import { EVENTS } from '../event.constants.js';
import { logger } from '../../shared/logger/logger.js';

/**
 * Lightweight subscriber that logs and could trigger analytics, notifications, etc.
 */
export function handle({ message, senderId, chatId, memberIds }) {
  logger.debug(
    `MESSAGE_CREATED chatId=${chatId} sender=${senderId} recipients=${memberIds.length - 1} messageId=${message._id}`
  );
}

export function register() {
  subscribe(EVENTS.MESSAGE_CREATED, handle);
}
