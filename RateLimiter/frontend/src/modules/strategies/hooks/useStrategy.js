import { useCallback, useEffect, useState } from 'react';
import * as strategyService from '../services/strategy.service.js';
import { extractErrorMessage } from '../../shared/utils/response.util.js';

export function useStrategies() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await strategyService.fetchStrategies());
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refresh: load };
}

export function useUpdateStrategy() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function update(strategyType) {
    setSaving(true);
    setError(null);
    try {
      const res = await strategyService.updateStrategy(strategyType);
      return res;
    } catch (err) {
      setError(extractErrorMessage(err));
      throw err;
    } finally {
      setSaving(false);
    }
  }

  return { update, saving, error };
}
