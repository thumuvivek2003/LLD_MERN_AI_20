import { useCallback, useEffect, useState } from 'react';
import * as usersService from '../services/users.service.js';
import { extractErrorMessage } from '../../shared/utils/response.util.js';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usersService.fetchUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(extractErrorMessage(err));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { users, loading, error, refresh: load };
}

export function useClientDetails(clientId) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!clientId) return;
    setLoading(true);
    setError(null);
    try {
      setDetails(await usersService.fetchClientDetails(clientId));
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  return { details, loading, error, refresh: load };
}

export function useUserActions(onChanged) {
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);

  async function run(action, clientId, payload) {
    setBusy(clientId);
    setError(null);
    try {
      const fnMap = {
        reset: usersService.resetClient,
        block: usersService.blockClient,
        unblock: usersService.unblockClient,
        create: usersService.createClient,
      };
      const fn = fnMap[action];
      if (!fn) throw new Error(`Unknown action: ${action}`);
      const res = action === 'create' ? await fn(payload) : await fn(clientId);
      onChanged?.();
      return res;
    } catch (err) {
      setError(extractErrorMessage(err));
      throw err;
    } finally {
      setBusy(null);
    }
  }

  return { run, busy, error };
}
