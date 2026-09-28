import { Link } from 'react-router-dom';
import { AUDIT_ACTION_LABEL, AUDIT_ACTION_TONE } from '../../../shared/enums/audit-action.enum.js';
import Badge from '../../../core/components/ui/Badge.jsx';
import Avatar from '../../../core/components/ui/Avatar.jsx';
import { EmptyState, ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import { formatRelative } from '../../../core/utils/formatters.js';

/** Compact audit stream shared by the admin dashboard and record History tabs. */
export function ActivityFeed({ entries = [], loading, error, onRetry, emptyTitle = 'No activity yet' }) {
  if (loading) return <div className="space-y-4 p-5">{<SkeletonText lines={6} />}</div>;
  if (error) return <ErrorState error={error} onRetry={onRetry} compact />;
  if (!entries.length) {
    return <EmptyState title={emptyTitle} description="Actions on this platform will show up here." compact />;
  }

  return (
    <ul className="divide-y divide-slate-50">
      {entries.map((entry) => (
        <li key={entry.auditId} className="flex items-start gap-3 px-5 py-3">
          <Avatar name={entry.userName} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-slate-700">
              <span className="font-semibold text-slate-900">{entry.userName}</span>{' '}
              <span className="text-slate-500">{entry.summary || AUDIT_ACTION_LABEL[entry.action]}</span>
            </p>
            <p className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <span>{formatRelative(entry.at)}</span>
              {entry.objectLabel && (
                <>
                  <span>·</span>
                  {entry.objectId ? (
                    <Link to={`/admin/objects/${entry.objectId}`} className="mf-link">
                      {entry.objectLabel}
                    </Link>
                  ) : (
                    <span>{entry.objectLabel}</span>
                  )}
                </>
              )}
              {entry.recordDisplayName && (
                <>
                  <span>·</span>
                  <span className="truncate">{entry.recordDisplayName}</span>
                </>
              )}
            </p>
          </div>
          <Badge tone={AUDIT_ACTION_TONE[entry.action] || 'slate'} className="shrink-0">
            {AUDIT_ACTION_LABEL[entry.action] || entry.action}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

export default ActivityFeed;
