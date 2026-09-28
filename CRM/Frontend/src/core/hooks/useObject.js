import { useCallback } from 'react';
import { useMetadata } from '../context/MetadataContext.jsx';
import useAsync from './useAsync.js';

/**
 * One full ObjectDefinition (incl. `fields[]`) served from the metadata cache.
 * Every dynamic form, record table and filter builder starts here.
 */
export function useObject(objectId) {
  const { getObject, invalidate } = useMetadata();

  const fetcher = useCallback(
    () => (objectId ? getObject(objectId) : Promise.resolve(null)),
    [objectId, getObject],
  );

  const { data, loading, error, reload } = useAsync(fetcher, [objectId]);

  const refresh = useCallback(async () => {
    await invalidate(objectId);
    return reload();
  }, [invalidate, objectId, reload]);

  return {
    object: data,
    fields: data?.fields || [],
    loading,
    error,
    reload,
    refresh,
  };
}

export default useObject;
