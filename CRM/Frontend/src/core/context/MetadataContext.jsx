import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import objectsApi from '../api/objects.api.js';
import fieldsApi from '../api/fields.api.js';
import { useUser } from './UserContext.jsx';

const MetadataContext = createContext(null);

/**
 * Client-side twin of the backend's metadata cache.
 * Objects (summary list) and full objects-with-fields are fetched once and reused,
 * so a dynamic form never re-downloads the schema it just rendered from.
 * `invalidate()` is called by every metadata mutation (publish, add field, reorder…).
 */
export function MetadataProvider({ children }) {
  const { userId } = useUser();
  const [objects, setObjects] = useState([]);
  const [fieldTypes, setFieldTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const detailCache = useRef(new Map());
  const inflight = useRef(new Map());

  const loadObjects = useCallback(async () => {
    setLoading(true);
    try {
      const list = await objectsApi.list({ limit: 200, sort: 'label', order: 'asc' });
      setObjects(Array.isArray(list) ? list : list?.items || []);
      setError(null);
    } catch (err) {
      setError(err);
      setObjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFieldTypes = useCallback(async () => {
    try {
      const types = await fieldsApi.types();
      setFieldTypes(Array.isArray(types) ? types : []);
    } catch {
      setFieldTypes([]);
    }
  }, []);

  useEffect(() => {
    detailCache.current.clear();
    inflight.current.clear();
    if (!userId) {
      setObjects([]);
      setFieldTypes([]);
      return;
    }
    loadObjects();
    loadFieldTypes();
  }, [userId, loadObjects, loadFieldTypes]);

  /** Full object incl. `fields[]`, memoised. De-dupes concurrent callers. */
  const getObject = useCallback(async (objectId, { force = false } = {}) => {
    if (!objectId) return null;
    if (!force && detailCache.current.has(objectId)) return detailCache.current.get(objectId);
    if (inflight.current.has(objectId)) return inflight.current.get(objectId);

    const promise = objectsApi
      .get(objectId)
      .then((definition) => {
        detailCache.current.set(objectId, definition);
        inflight.current.delete(objectId);
        return definition;
      })
      .catch((err) => {
        inflight.current.delete(objectId);
        throw err;
      });

    inflight.current.set(objectId, promise);
    return promise;
  }, []);

  const invalidate = useCallback(
    (objectId) => {
      if (objectId) detailCache.current.delete(objectId);
      else detailCache.current.clear();
      return loadObjects();
    },
    [loadObjects],
  );

  const value = useMemo(
    () => ({
      objects,
      fieldTypes,
      loading,
      error,
      getObject,
      invalidate,
      reload: loadObjects,
      objectById: (objectId) => objects.find((object) => object.objectId === objectId) || null,
    }),
    [objects, fieldTypes, loading, error, getObject, invalidate, loadObjects],
  );

  return <MetadataContext.Provider value={value}>{children}</MetadataContext.Provider>;
}

export const useMetadata = () => {
  const context = useContext(MetadataContext);
  if (!context) throw new Error('useMetadata must be used inside <MetadataProvider>');
  return context;
};

export default MetadataContext;
