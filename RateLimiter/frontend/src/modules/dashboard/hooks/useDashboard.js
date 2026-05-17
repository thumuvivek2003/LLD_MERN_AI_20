import { useCallback, useEffect, useState } from 'react';
import * as dashboardService from '../services/dashboard.service.js';
import { extractErrorMessage } from '../../shared/utils/response.util.js';

export function useDashboardData(kind = 'admin') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fn =
        kind === 'admin'
          ? dashboardService.fetchAdminDashboard
          : dashboardService.fetchClientDashboard;
      const result = await fn();
      setData(result);
    } catch (err) {
      setError(extractErrorMessage(err));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [kind]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refresh: load };
}
