import { InMemoryQueue } from '../shared/queue/inMemory.queue.js';

/**
 * Factory for the in-memory queue. Kept tiny on purpose — the singleton
 * accessor in shared/queue/queueManager.js calls this once at boot time.
 */
export function createQueue() {
  return new InMemoryQueue();
}
