import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMailSearch } from '../hooks/useMailSearch.js';
import SearchInput from '../components/SearchInput.jsx';
import SearchFilters from '../components/SearchFilters.jsx';
import SearchResultList from '../components/SearchResultList.jsx';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const {
    query,
    setQuery,
    type,
    setType,
    results,
    loading,
    error,
    hasSearched,
  } = useMailSearch(initialQuery, searchParams.get('type') || 'all');

  // Keep the URL in sync so searches are shareable / back-navigable.
  useEffect(() => {
    const next = {};
    if (query.trim()) next.q = query.trim();
    if (type !== 'all') next.type = type;
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, type]);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
          Search
        </h1>
        <p className="mt-0.5 text-sm text-slate-400">Search across all emails</p>
      </div>

      <div className="mb-4">
        <SearchInput value={query} onChange={setQuery} autoFocus />
      </div>

      <div className="mb-5 flex items-center justify-between gap-3">
        <SearchFilters type={type} onChange={setType} />
        {(query || type !== 'all') && (
          <button
            onClick={() => {
              setQuery('');
              setType('all');
            }}
            className="shrink-0 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            Clear all
          </button>
        )}
      </div>

      <SearchResultList
        results={results}
        query={query.trim()}
        loading={loading}
        error={error}
        hasSearched={hasSearched}
      />
    </div>
  );
}
