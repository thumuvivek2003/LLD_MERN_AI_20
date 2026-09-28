import { useCallback } from 'react';
import fieldsApi from '../api/fields.api.js';
import { useMetadata } from '../context/MetadataContext.jsx';
import useAsync from './useAsync.js';

/**
 * Field list for one object plus the mutations the Admin field screens need.
 * Every mutation invalidates the metadata cache so dependent forms re-render.
 */
export function useFields(objectId) {
  const { invalidate } = useMetadata();

  const fetcher = useCallback(
    () => (objectId ? fieldsApi.list(objectId) : Promise.resolve([])),
    [objectId],
  );

  const { data, loading, error, reload } = useAsync(fetcher, [objectId], { initialData: [] });

  const after = useCallback(
    async (result) => {
      await invalidate(objectId);
      await reload();
      return result;
    },
    [invalidate, objectId, reload],
  );

  return {
    fields: Array.isArray(data) ? data : [],
    loading,
    error,
    reload,
    create: (payload) => fieldsApi.create(objectId, payload).then(after),
    update: (fieldId, patch) => fieldsApi.update(objectId, fieldId, patch).then(after),
    remove: (fieldId) => fieldsApi.remove(objectId, fieldId).then(after),
    reorder: (order) => fieldsApi.reorder(objectId, order).then(after),
  };
}

/** The `/field-types` catalogue that drives the Add Field wizard. */
export function useFieldTypes() {
  const { data, loading, error } = useAsync(() => fieldsApi.types(), [], { initialData: [] });
  return { fieldTypes: Array.isArray(data) ? data : [], loading, error };
}

export default useFields;
