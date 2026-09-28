import { useCallback, useRef, useState } from 'react';
import searchApi from '../api/search.api.js';
import SearchQueryBuilder from '../utils/queryBuilder.js';

/**
 * Index-backed search. Always driven through `SearchQueryBuilder`, never a hand-built body.
 * Exposes the backend's `plan` so the UI can show "why this matched / how fast".
 */
export function useSearch() {
  const [records, setRecords] = useState([]);
  const [plan, setPlan] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ran, setRan] = useState(false);
  const lastQuery = useRef(null);

  const run = useCallback(async (builder) => {
    const query = builder instanceof SearchQueryBuilder ? builder.build() : builder;
    lastQuery.current = query;
    setLoading(true);
    setError(null);
    try {
      const result = await searchApi.run(query);
      setRecords(result?.records || []);
      setPlan(result?.plan || null);
      setMeta(result?.meta || null);
      setRan(true);
      return result;
    } catch (err) {
      setError(err);
      setRecords([]);
      setPlan(null);
      setMeta(null);
      setRan(true);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setRecords([]);
    setPlan(null);
    setMeta(null);
    setError(null);
    setRan(false);
    lastQuery.current = null;
  }, []);

  return { records, plan, meta, loading, error, ran, run, reset, lastQuery: lastQuery.current };
}

/** TRIE-backed type-ahead for a single searchable field. */
export function useSuggest() {
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = useCallback(async (objectId, fieldId, prefix) => {
    if (!objectId || !fieldId || !prefix) {
      setSuggestions([]);
      return [];
    }
    try {
      const result = await searchApi.suggest({ objectId, fieldId, prefix });
      const list = Array.isArray(result) ? result : [];
      setSuggestions(list);
      return list;
    } catch {
      setSuggestions([]);
      return [];
    }
  }, []);

  return { suggestions, fetchSuggestions, clear: () => setSuggestions([]) };
}

export default useSearch;
