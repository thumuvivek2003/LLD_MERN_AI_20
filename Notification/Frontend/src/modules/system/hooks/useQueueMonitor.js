import { useCallback, useEffect, useState } from 'react';
import {
  fetchQueueStatus,
  fetchRetryJobs,
  fetchDeliveryLogs,
} from '../services/system.service.js';

export function useQueueMonitor(view = 'queue') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fn =
        view === 'retry'
          ? fetchRetryJobs
          : view === 'logs'
            ? fetchDeliveryLogs
            : fetchQueueStatus;
      const d = await fn();
      setData(d);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [view]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
