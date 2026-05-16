import { getQueueInstance } from '../../../shared/queue/queueManager.js';
import { logger } from '../../../shared/logger/logger.js';

export const systemService = {
  getQueueSnapshot() {
    const snap = getQueueInstance().snapshot();
    return {
      size: snap.size,
      workers: snap.workers,
      jobs: snap.jobs,
    };
  },

  getRetryQueueSnapshot() {
    const snap = getQueueInstance().snapshot();
    return {
      size: snap.retrySize,
      jobs: snap.retryJobs,
    };
  },

  getLogs(limit = 100) {
    return logger.getRecent(limit);
  },
};
