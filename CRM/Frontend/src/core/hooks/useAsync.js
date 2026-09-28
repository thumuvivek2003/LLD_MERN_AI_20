import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * The one fetch primitive every other hook builds on.
 * Owns { data, loading, error, reload } and guards against setState-after-unmount
 * and out-of-order responses.
 *
 * @param {Function} task    async () => data
 * @param {Array}    deps    re-run triggers
 * @param {Object}   options { immediate = true, initialData = null }
 */
export function useAsync(task, deps = [], { immediate = true, initialData = null } = {}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const mounted = useRef(true);
  const runId = useRef(0);
  const taskRef = useRef(task);
  taskRef.current = task;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(async (...args) => {
    const id = ++runId.current;
    setLoading(true);
    setError(null);
    try {
      const result = await taskRef.current(...args);
      if (mounted.current && id === runId.current) setData(result);
      return result;
    } catch (err) {
      if (mounted.current && id === runId.current) {
        setError(err);
        setData(initialData);
      }
      throw err;
    } finally {
      if (mounted.current && id === runId.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!immediate) return;
    run().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, reload: run, setData };
}

export default useAsync;
