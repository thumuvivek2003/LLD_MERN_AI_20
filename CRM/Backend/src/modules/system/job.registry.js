import { JOB_STATUS } from '../../config/constants.js';
import { newId } from '../../core/utils/id.util.js';
import { logger } from '../../core/utils/logger.util.js';

/**
 * In-memory job registry behind `GET /system/jobs`.
 *
 * Two kinds of job live here:
 *  - scheduled jobs registered at boot (index optimization, audit archive, …)
 *  - ad-hoc jobs created by an admin action (rebuild this index)
 *
 * Nothing is faked: `status`, `progress`, `startedAt` and `finishedAt` are all
 * written by the runner as the work actually happens.
 */
export class JobRegistry {
  constructor() {
    this.jobs = new Map();
    this.timers = [];
  }

  register({ jobId = newId('job'), name, detail = '', handler, everyMs = null }) {
    const job = {
      jobId,
      name,
      detail,
      status: JOB_STATUS.QUEUED,
      progress: 0,
      startedAt: null,
      finishedAt: null,
      lastError: null,
      runCount: 0,
      everyMs,
      handler,
    };
    this.jobs.set(jobId, job);
    return job;
  }

  schedule(spec) {
    const job = this.register(spec);
    if (spec.everyMs) {
      const timer = setInterval(() => this.run(job.jobId).catch(() => {}), spec.everyMs);
      timer.unref?.();
      this.timers.push(timer);
    }
    return job;
  }

  async run(jobId) {
    const job = this.jobs.get(jobId);
    if (!job) return null;
    if (job.status === JOB_STATUS.RUNNING) return this.view(job);

    job.status = JOB_STATUS.RUNNING;
    job.progress = 0;
    job.startedAt = new Date();
    job.finishedAt = null;
    job.lastError = null;

    try {
      const result = await job.handler({ report: (p) => { job.progress = Math.min(99, Math.round(p)); } });
      job.status = JOB_STATUS.COMPLETED;
      job.progress = 100;
      job.detail = result?.detail || job.detail;
      job.runCount += 1;
    } catch (err) {
      job.status = JOB_STATUS.FAILED;
      job.lastError = err.message;
      logger.error(`Job ${job.name} failed: ${err.message}`, null, 'scheduler');
    } finally {
      job.finishedAt = new Date();
    }
    return this.view(job);
  }

  /** Fire-and-forget so an HTTP handler can return the job immediately. */
  runDetached(jobId) {
    const job = this.jobs.get(jobId);
    if (!job) return null;
    job.status = JOB_STATUS.QUEUED;
    setImmediate(() => this.run(jobId).catch(() => {}));
    return this.view(job);
  }

  view(job) {
    const { handler, everyMs, ...rest } = job;
    return { ...rest, intervalMs: everyMs };
  }

  get(jobId) {
    const job = this.jobs.get(jobId);
    return job ? this.view(job) : null;
  }

  list() {
    return [...this.jobs.values()].map((j) => this.view(j));
  }

  counts() {
    const list = this.list();
    return {
      running: list.filter((j) => j.status === JOB_STATUS.RUNNING).length,
      queued: list.filter((j) => j.status === JOB_STATUS.QUEUED).length,
      completed: list.filter((j) => j.status === JOB_STATUS.COMPLETED).length,
      failed: list.filter((j) => j.status === JOB_STATUS.FAILED).length,
    };
  }

  stopAll() {
    for (const t of this.timers) clearInterval(t);
    this.timers = [];
  }
}
