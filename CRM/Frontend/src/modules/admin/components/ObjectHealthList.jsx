import { Link } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';
import { Card, CardHeader } from '../../../core/components/ui/Card.jsx';
import { EmptyState } from '../../../core/components/ui/EmptyState.jsx';
import StatusPill from '../../../core/components/ui/StatusPill.jsx';
import { objectColorClass, resolveIcon } from '../../../core/utils/icons.js';
import { formatCompact } from '../../../core/utils/formatters.js';
import cx from '../../../core/utils/cx.js';

/** Busiest objects by record count — a quick jump-off from the dashboard. */
export function ObjectHealthList({ objects = [], limit = 6 }) {
  const top = [...objects]
    .sort((a, b) => (b.recordCount ?? 0) - (a.recordCount ?? 0))
    .slice(0, limit);

  return (
    <Card>
      <CardHeader
        title="Top Objects"
        subtitle="By record volume"
        icon={LayoutGrid}
        actions={
          <Link to="/admin/objects" className="text-xs font-semibold text-accent hover:underline">
            All objects
          </Link>
        }
      />
      {top.length ? (
        <ul className="divide-y divide-slate-50">
          {top.map((object) => {
            const Icon = resolveIcon(object.icon);
            return (
              <li key={object.objectId}>
                <Link
                  to={`/admin/objects/${object.objectId}`}
                  className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50/70"
                >
                  <span
                    className={cx(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1',
                      objectColorClass(object.color),
                    )}
                  >
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{object.label}</p>
                    <p className="truncate text-[11px] text-slate-400">
                      {formatCompact(object.recordCount)} records · {object.fieldCount ?? 0} fields
                    </p>
                  </div>
                  <StatusPill kind="object" status={object.status} />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState title="No objects yet" description="Create your first custom object." compact />
      )}
    </Card>
  );
}

export default ObjectHealthList;
