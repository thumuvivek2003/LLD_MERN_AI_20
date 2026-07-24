import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Runs an async function, tracking { data, loading, error }.
 * @param {Function} asyncFn
 * @param {Array} deps  dependency list controlling auto-run
 * @param {boolean} immediate  run on mount / dep change
 */
export function useAsync(asyncFn, deps = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const run = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn(...args);
      if (mountedRef.current) setData(result);
      return result;
    } catch (e) {
      if (mountedRef.current) setError(e.message || 'Something went wrong');
      throw e;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (immediate) run().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, setData, loading, error, run };
}

export default useAsync;
