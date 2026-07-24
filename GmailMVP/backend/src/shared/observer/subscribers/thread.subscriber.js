import { eventBus } from '../../singleton/event-bus.singleton.js';
import { MAIL_EVENTS } from '../events/mail.events.js';
import * as threadService from '../../../modules/thread/thread.service.js';

/**
 * Thread subscriber (Observer)
 * Reacts to MAIL_SENT: creates a thread for a root mail, or appends the mail
 * to its existing thread for a reply. Participants are merged either way.
 */
export function registerThreadSubscriber() {
  eventBus.subscribe(MAIL_EVENTS.MAIL_SENT, async ({ mail, isReply }) => {
    try {
      const participantIds = [
        mail.sender?._id ?? mail.sender,
        ...(mail.receivers || []).map((r) => r?._id ?? r),
      ];

      if (isReply) {
        await threadService.appendReply(mail.threadId, mail._id, participantIds);
      } else {
        await threadService.createThread({
          _id: mail.threadId,
          subject: mail.subject,
          mailIds: [mail._id],
          participants: participantIds,
        });
      }
    } catch (err) {
      console.error('[thread.subscriber] failed to link mail to thread:', err.message);
    }
  });
  console.log('[observer] thread subscriber registered');
}
