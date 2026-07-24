import { eventBus } from '../../singleton/event-bus.singleton.js';
import { MAIL_EVENTS } from '../events/mail.events.js';
import { socketManager } from '../../singleton/socket-manager.singleton.js';
import { SOCKET_EVENTS } from '../../constants/socket-events.constant.js';
import { toMailDTO } from '../../../modules/mail/mail.mapper.js';

/**
 * Socket subscriber (Observer)
 * Reacts to MAIL_SENT by pushing the new mail (as a MailDTO viewed by that
 * recipient) to each receiver's socket room in real time.
 */
export function registerSocketSubscriber() {
  eventBus.subscribe(MAIL_EVENTS.MAIL_SENT, ({ mail }) => {
    try {
      for (const receiver of mail.receivers || []) {
        const receiverId = String(receiver?._id ?? receiver);
        const dto = toMailDTO(mail, receiverId);
        socketManager.emitToUser(receiverId, SOCKET_EVENTS.MAIL_RECEIVED, dto);
      }
    } catch (err) {
      console.error('[socket.subscriber] failed to emit mail:received:', err.message);
    }
  });
  console.log('[observer] socket subscriber registered');
}
