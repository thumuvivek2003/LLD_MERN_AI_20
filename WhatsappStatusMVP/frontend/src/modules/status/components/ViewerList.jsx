// modules/status/components/ViewerList.jsx — the "Seen by N" list (Screen 11).
import { ViewerItem } from './ViewerItem.jsx';
import { Loader } from '../../../core/components/Loader.jsx';
import { EmptyState } from '../../../core/components/EmptyState.jsx';

export function ViewerList({ viewers, count, loading }) {
  if (loading) return <Loader label="Loading viewers…" />;
  if (count === 0) return <EmptyState icon="👀" title="No views yet" subtitle="When someone views this status, they'll appear here." />;
  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-3 text-sm text-wa-muted border-b border-wa-line">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
        Seen by {count}
      </div>
      {viewers.map((v) => (
        <ViewerItem key={v.id} viewer={v} />
      ))}
    </div>
  );
}
