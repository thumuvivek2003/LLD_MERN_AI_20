import { useEffect, useState } from 'react';
import { analyticsApi } from '../services/analytics.api.js';

export function useAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    analyticsApi.dashboard().then((r) => setData(r.data)).finally(() => setLoading(false));
  }, []);
  return { data, loading };
}
