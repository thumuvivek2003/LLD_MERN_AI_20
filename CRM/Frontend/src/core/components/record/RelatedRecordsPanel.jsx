import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Link2 } from 'lucide-react';
import { resolveIcon } from '../../utils/icons.js';
import { Tabs } from '../ui/Tabs.jsx';
import { EmptyState, ErrorState } from '../ui/EmptyState.jsx';
import { SkeletonText } from '../ui/Skeleton.jsx';

/**
 * `GET /objects/:oid/records/:rid/related` rendered as one tab per child object
 * (Business screen 13 / the Related tab on both consoles).
 */
export function RelatedRecordsPanel({ groups = [], loading, error, onRetry, recordLinkTo }) {
  const [active, setActive] = useState(null);

  if (loading) return <SkeletonText lines={6} />;
  if (error) return <ErrorState error={error} onRetry={onRetry} compact />;
  if (!groups.length) {
    return (
      <EmptyState
        icon={Link2}
        title="No related records"
        description="Nothing points back at this record yet."
        compact
      />
    );
  }

  const currentId = active ?? groups[0].objectId;
  const current = groups.find((group) => group.objectId === currentId) || groups[0];

  return (
    <div>
      <Tabs
        tabs={groups.map((group) => ({
          id: group.objectId,
          label: group.label,
          count: group.count,
          icon: resolveIcon(group.icon),
        }))}
        active={currentId}
        onChange={setActive}
        className="mb-4"
      />

      {!current.records?.length ? (
        <EmptyState title={`No ${current.label} records`} compact />
      ) : (
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200">
          {current.records.map((record) => (
            <li key={record.recordId}>
              <Link
                to={recordLinkTo(current.objectId, record.recordId)}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition hover:bg-slate-50/70"
              >
                <span className="text-sm font-semibold text-slate-800">{record.displayName}</span>
                {record.summary && (
                  <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                    {Object.entries(record.summary).map(([key, value]) => (
                      <span key={key}>
                        <span className="text-slate-400">{key}: </span>
                        {String(value)}
                      </span>
                    ))}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RelatedRecordsPanel;
