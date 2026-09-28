import { useCallback, useMemo, useState } from 'react';

/**
 * Page/limit state + the `meta` echoed back by the API.
 * Pages pass `meta` straight from a response; the hook derives total/totalPages.
 */
export function usePagination({ initialPage = 1, initialLimit = 25 } = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimitState] = useState(initialLimit);
  const [meta, setMeta] = useState(null);

  const setLimit = useCallback((next) => {
    setLimitState(next);
    setPage(1);
  }, []);

  const reset = useCallback(() => setPage(1), []);

  return useMemo(
    () => ({
      page,
      limit,
      setPage,
      setLimit,
      reset,
      meta,
      setMeta,
      total: meta?.total ?? 0,
      totalPages: meta?.totalPages ?? 0,
      params: { page, limit },
    }),
    [page, limit, meta, setLimit, reset],
  );
}

export default usePagination;
