import { useEffect, useState } from 'react';
import { useUser } from '../../../shared/context/UserContext.jsx';
import { useDebounce } from '../../../shared/hooks/useDebounce.js';
import { SearchService } from '../../../shared/services/SearchService.js';

/**
 * Debounced mail search. Re-runs whenever the query or the search type
 * (Strategy) changes.
 */
export function useMailSearch(initialQuery = '', initialType = 'all') {
  const { currentUser } = useUser();
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(initialType);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    const term = debouncedQuery.trim();
    if (!currentUser?.id || term.length === 0) {
      setResults([]);
      setHasSearched(false);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    SearchService.search({ userId: currentUser.id, q: term, type })
      .then((data) => {
        if (!cancelled) {
          setResults(data);
          setHasSearched(true);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Search failed');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, type, currentUser?.id]);

  return {
    query,
    setQuery,
    type,
    setType,
    results,
    loading,
    error,
    hasSearched,
  };
}

export default useMailSearch;
