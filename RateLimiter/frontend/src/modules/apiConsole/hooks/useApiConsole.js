import { useState } from 'react';
import * as apiConsoleService from '../services/apiConsole.service.js';
import { extractErrorMessage } from '../../shared/utils/response.util.js';

export function useSendRequest() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function send({ endpoint, apiKey }) {
    setLoading(true);
    setError(null);
    try {
      const res = await apiConsoleService.sendRequest({ endpoint, apiKey });
      setResult(res);
      return res;
    } catch (err) {
      setError(extractErrorMessage(err));
      setResult(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { send, result, loading, error };
}
