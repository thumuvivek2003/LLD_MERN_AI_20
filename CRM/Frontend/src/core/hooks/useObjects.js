import { useCallback } from 'react';
import objectsApi from '../api/objects.api.js';
import useAsync from './useAsync.js';

/**
 * Paginated object list for the Admin → Objects screen.
 * `params` = { q, status, page, limit, sort, order }.
 */
export function useObjects(params = {}) {
  const { q = '', status = '', page = 1, limit = 25, sort = 'label', order = 'asc' } = params;

  const fetcher = useCallback(
    () =>
      objectsApi.list({
        page,
        limit,
        sort,
        order,
        ...(q ? { q } : {}),
        ...(status ? { status } : {}),
      }),
    [q, status, page, limit, sort, order],
  );

  const { data, loading, error, reload } = useAsync(fetcher, [q, status, page, limit, sort, order], {
    initialData: [],
  });

  const list = Array.isArray(data) ? data : data?.items || [];
  return { objects: list, meta: data?.meta ?? list.meta ?? null, loading, error, reload };
}

export default useObjects;
