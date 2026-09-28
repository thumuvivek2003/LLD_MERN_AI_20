import { useCallback } from 'react';
import recordsApi from '../api/records.api.js';
import useAsync from './useAsync.js';

/** One record (with `resolved` lookups) plus its mutations. */
export function useRecord(objectId, recordId) {
  const fetcher = useCallback(
    () => (objectId && recordId ? recordsApi.get(objectId, recordId) : Promise.resolve(null)),
    [objectId, recordId],
  );

  const { data, loading, error, reload } = useAsync(fetcher, [objectId, recordId]);

  return {
    record: data,
    resolved: data?.resolved || {},
    loading,
    error,
    reload,
    update: (recordJson) => recordsApi.update(objectId, recordId, recordJson).then(reloadThen(reload)),
    archive: () => recordsApi.archive(objectId, recordId).then(reloadThen(reload)),
    restore: () => recordsApi.restore(objectId, recordId).then(reloadThen(reload)),
  };
}

/** Reverse-lookup panels for the record's Related tab. */
export function useRelatedRecords(objectId, recordId, { enabled = true } = {}) {
  const fetcher = useCallback(
    () => (enabled && objectId && recordId ? recordsApi.related(objectId, recordId) : Promise.resolve([])),
    [enabled, objectId, recordId],
  );
  const { data, loading, error, reload } = useAsync(fetcher, [enabled, objectId, recordId], {
    initialData: [],
  });
  return { related: Array.isArray(data) ? data : [], loading, error, reload };
}

/** Audit entries scoped to a single record — the History tab. */
export function useRecordHistory(objectId, recordId, { enabled = true } = {}) {
  const fetcher = useCallback(
    () => (enabled && objectId && recordId ? recordsApi.history(objectId, recordId) : Promise.resolve([])),
    [enabled, objectId, recordId],
  );
  const { data, loading, error, reload } = useAsync(fetcher, [enabled, objectId, recordId], {
    initialData: [],
  });
  return { history: Array.isArray(data) ? data : [], loading, error, reload };
}

const reloadThen = (reload) => async (result) => {
  await reload();
  return result;
};

export default useRecord;
