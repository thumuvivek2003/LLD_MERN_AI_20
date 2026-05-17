import * as messageCreated from './message-created.subscriber.js';
import * as deliverySub from './delivery.subscriber.js';
import * as presenceSub from './presence.subscriber.js';
import * as socketSub from './socket.subscriber.js';

/**
 * Register all observers exactly once at boot.
 */
export function registerSubscribers() {
  messageCreated.register();
  deliverySub.register();
  presenceSub.register();
  socketSub.register();
}
