import { useMemo, useState } from 'react';

/**
 * Simple client-side pagination helper.
 */
export function usePagination(items = [], pageSize = 10) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  function next() {
    setPage((p) => Math.min(totalPages, p + 1));
  }
  function prev() {
    setPage((p) => Math.max(1, p - 1));
  }

  return { page, setPage, totalPages, paged, next, prev };
}
