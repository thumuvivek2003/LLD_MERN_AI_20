import { EventEmitter } from 'node:events';

/**
 * Simple in-memory FIFO queue with EventEmitter for Observer pattern.
 * Supports:
 *   - immediate enqueue: enqueue(job)
 *   - delayed enqueue (retries): enqueueDelayed(job, delayMs)
 *
 * Emits "job:enqueued" whenever a job lands in the main queue (so workers
 * can react instead of busy-polling).
 */
export class InMemoryQueue extends EventEmitter {
  constructor() {
    super();
    this._jobs = [];           // [{ id, notificationId, attempt, scheduledAt, type }]
    this._retryJobs = [];      // pending delayed jobs (with scheduledAt in future)
    this._workers = 0;
  }

  registerWorker() {
    this._workers += 1;
  }

  enqueue(job) {
    const enriched = {
      id: job.id,
      notificationId: job.notificationId,
      attempt: job.attempt ?? 0,
      scheduledAt: new Date().toISOString(),
      type: job.type ?? 'send',
      ...job,
    };
    this._jobs.push(enriched);
    this.emit('job:enqueued', enriched);
    return enriched;
  }

  enqueueDelayed(job, delayMs) {
    const scheduledAt = new Date(Date.now() + delayMs).toISOString();
    const enriched = {
      id: job.id,
      notificationId: job.notificationId,
      attempt: job.attempt ?? 1,
      scheduledAt,
      type: job.type ?? 'retry',
      ...job,
      scheduledAt,
    };
    this._retryJobs.push(enriched);
    this.emit('job:scheduled', enriched);
    return enriched;
  }

  dequeue() {
    return this._jobs.shift() ?? null;
  }

  /** Move any retry jobs whose scheduledAt is past into the main queue. */
  drainDueRetries() {
    const now = Date.now();
    const due = [];
    this._retryJobs = this._retryJobs.filter((job) => {
      if (new Date(job.scheduledAt).getTime() <= now) {
        due.push(job);
        return false;
      }
      return true;
    });
    for (const job of due) {
      this._jobs.push(job);
      this.emit('job:enqueued', job);
    }
    return due.length;
  }

  snapshot() {
    return {
      size: this._jobs.length,
      retrySize: this._retryJobs.length,
      workers: this._workers,
      jobs: this._jobs.slice(0, 50).map((j) => ({
        id: j.id,
        notificationId: j.notificationId,
        attempt: j.attempt,
        scheduledAt: j.scheduledAt,
        type: j.type,
      })),
      retryJobs: this._retryJobs.slice(0, 50).map((j) => ({
        id: j.id,
        notificationId: j.notificationId,
        attempt: j.attempt,
        scheduledAt: j.scheduledAt,
      })),
    };
  }
}
