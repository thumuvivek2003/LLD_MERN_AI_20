import { eventBus } from '../../singleton/event-bus.singleton.js';
import { MAIL_EVENTS } from '../events/mail.events.js';
import * as searchService from '../../../modules/search/search.service.js';

/**
 * Index subscriber (Observer)
 * Reacts to MAIL_SENT by adding the new mail to the in-memory inverted index
 * so it becomes searchable immediately.
 */
export function registerIndexSubscriber() {
  eventBus.subscribe(MAIL_EVENTS.MAIL_SENT, ({ mail }) => {
    try {
      searchService.indexMail(mail);
    } catch (err) {
      console.error('[index.subscriber] failed to index mail:', err.message);
    }
  });
  console.log('[observer] index subscriber registered');
}
