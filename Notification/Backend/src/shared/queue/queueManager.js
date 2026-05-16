import { createQueue } from '../../config/queue.config.js';

/**
 * Singleton accessor for the in-memory queue + event bus.
 * Other modules import {@link getQueueInstance} — never construct the queue directly.
 */
let instance = null;

export function getQueueInstance() {
  if (!instance) {
    instance = createQueue();
  }
  return instance;
}
