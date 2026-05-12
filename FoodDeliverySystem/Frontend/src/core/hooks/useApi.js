import { useState, useCallback, useEffect } from 'react';

export const useApi = (apiFn, { immediate = false, args = [] } = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...callArgs) => {
    setLoading(true); setError(null);
    try {
      const res = await apiFn(...callArgs);
      setData(res?.data ?? res);
      return res?.data ?? res;
    } catch (e) {
      setError(e.message || 'Request failed');
      throw e;
    } finally { setLoading(false); }
  }, [apiFn]);

  useEffect(() => {
    if (immediate) execute(...args).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, execute, setData };
};
