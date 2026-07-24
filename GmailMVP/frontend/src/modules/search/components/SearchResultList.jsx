import SearchResultCard from './SearchResultCard.jsx';
import EmptyState from '../../../shared/components/EmptyState.jsx';
import { MailSkeleton } from '../../../shared/components/Loader.jsx';
import { SearchIcon } from '../../../shared/components/Icons.jsx';

export default function SearchResultList({
  results,
  query,
  loading,
  error,
  hasSearched,
}) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <MailSkeleton rows={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-card">
        <EmptyState icon={SearchIcon} title="Search failed" description={error} />
      </div>
    );
  }

  if (!query.trim()) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-card">
        <EmptyState
          icon={SearchIcon}
          title="Search your mail"
          description="Find messages by sender, recipient, subject or body."
        />
      </div>
    );
  }

  if (hasSearched && results.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-card">
        <EmptyState
          icon={SearchIcon}
          title="No results found"
          description={`No emails match “${query}”.`}
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Top results
        </span>
        <span className="text-xs text-slate-400">
          {results.length} result{results.length === 1 ? '' : 's'}
        </span>
      </div>
      <div className="divide-y divide-slate-100">
        {results.map((m) => (
          <SearchResultCard key={m.id} mail={m} query={query} />
        ))}
      </div>
    </div>
  );
}
