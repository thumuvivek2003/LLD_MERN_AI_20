import { useCallback, useEffect } from 'react';
import { useTemplateStore } from '../state/template.store.js';
import {
  fetchTemplates,
  createTemplate,
  createTemplateVersion,
} from '../services/template.service.js';

export function useTemplates() {
  const {
    templates,
    setTemplates,
    loading,
    setLoading,
    error,
    setError,
  } = useTemplateStore();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTemplates();
      const items = Array.isArray(data) ? data : data?.items || [];
      setTemplates(items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setTemplates, setLoading, setError]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (payload) => {
      const created = await createTemplate(payload);
      await load();
      return created;
    },
    [load],
  );

  const newVersion = useCallback(
    async (id, payload) => {
      const version = await createTemplateVersion(id, payload);
      await load();
      return version;
    },
    [load],
  );

  return { templates, loading, error, reload: load, create, newVersion };
}
