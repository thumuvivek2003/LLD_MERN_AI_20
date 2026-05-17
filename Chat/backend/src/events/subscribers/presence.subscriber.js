import { subscribe } from '../event-bus.js';
import { EVENTS } from '../event.constants.js';
import { MessageStatusModel } from '../../models/delivery.model.js';
import { MESSAGE_STATUS } from '../../modules/delivery/delivery.constants.js';
import { markDelivered } from '../../modules/delivery/delivery.service.js';
import { logger } from '../../shared/logger/logger.js';

/**
 * When a user comes online, flip every pending SENT status of theirs
 * to DELIVERED — so message dots update across the chat.
 */
export async function handle({ userId }) {
  try {
    const pending = await MessageStatusModel.find({
      userId,
      status: MESSAGE_STATUS.SENT,
    })
      .select('messageId')
      .lean();
    for (const row of pending) {
      await markDelivered({ messageId: row.messageId, userId }).catch(() => {});
    }
  } catch (err) {
    logger.warn('presence-subscriber backfill failed:', err?.message);
  }
}

export function register() {
  subscribe(EVENTS.USER_ONLINE, handle);
}
