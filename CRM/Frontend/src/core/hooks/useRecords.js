import { useCallback } from 'react';
import recordsApi from '../api/records.api.js';
import useAsync from './useAsync.js';

/**
 * Paginated record list for one object.
 * `params` = { page, limit, sort, order, status, q }.
 */
export function useRecords(objectId, params = {}) {
  const { page = 1, limit = 25, sort = '', order = 'asc', status = '', q = '' } = params;

  const fetcher = useCallback(() => {
    if (!objectId) return Promise.resolve([]);
    return recordsApi.list(objectId, {
      page,
      limit,
      ...(sort ? { sort, order } : {}),
      ...(status ? { status } : {}),
      ...(q ? { q } : {}),
    });
  }, [objectId, page, limit, sort, order, status, q]);

  const { data, loading, error, reload } = useAsync(
    fetcher,
    [objectId, page, limit, sort, order, status, q],
    { initialData: [] },
  );

  const list = Array.isArray(data) ? data : data?.records || [];
  return { records: list, meta: list.meta ?? data?.meta ?? null, loading, error, reload };
}

export default useRecords;
