import { useCallback, useEffect, useState } from 'react';
import * as configService from '../services/configuration.service.js';
import { extractErrorMessage } from '../../shared/utils/response.util.js';

export function useConfig() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setConfig(await configService.fetchConfig());
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { config, loading, error, refresh: load, setConfig };
}

export function useSaveConfig() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function save(payload) {
    setSaving(true);
    setError(null);
    try {
      return await configService.saveConfig(payload);
    } catch (err) {
      setError(extractErrorMessage(err));
      throw err;
    } finally {
      setSaving(false);
    }
  }

  return { save, saving, error };
}
