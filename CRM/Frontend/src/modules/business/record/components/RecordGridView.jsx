import { Link } from 'react-router-dom';
import { Table2 } from 'lucide-react';
import FieldRenderer from '../../../../core/components/form/FieldRenderer.jsx';
import Avatar from '../../../../core/components/ui/Avatar.jsx';
import StatusPill from '../../../../core/components/ui/StatusPill.jsx';
import { EmptyState, ErrorState } from '../../../../core/components/ui/EmptyState.jsx';
import { SkeletonCards } from '../../../../core/components/ui/Skeleton.jsx';
import cx from '../../../../core/utils/cx.js';

/**
 * Card layout for the list/grid/board toggle on Business screen 8.
 * `columns` = 2 renders the wider "board" arrangement.
 */
export function RecordGridView({
  objectId,
  fields = [],
  records = [],
  loading,
  error,
  onRetry,
  columns = 3,
}) {
  if (loading) return <SkeletonCards count={6} />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (!records.length) {
    return <EmptyState icon={Table2} title="No records" description="Create the first record for this object." />;
  }

  const [primary, ...rest] = fields;

  return (
    <div
      className={cx(
        'grid gap-4',
        columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 xl:grid-cols-3',
      )}
    >
      {records.map((record) => (
        <Link
          key={record.recordId}
          to={`/business/objects/${objectId}/records/${record.recordId}`}
          className="mf-card flex flex-col gap-3 p-4 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-pop"
        >
          <div className="flex items-start gap-3">
            <Avatar name={record.displayName} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">
                {record.displayName || record.recordId}
              </p>
              {primary && (
                <p className="truncate text-[11px] text-slate-400">{primary.label}</p>
              )}
            </div>
            <StatusPill kind="record" status={record.status} />
          </div>

          <dl className="space-y-1.5 border-t border-slate-100 pt-3">
            {rest.slice(0, 4).map((field) => (
              <div key={field.fieldId} className="flex items-start justify-between gap-3">
                <dt className="shrink-0 text-[11px] text-slate-400">{field.label}</dt>
                <dd className="min-w-0 truncate text-right text-xs font-medium text-slate-700">
                  <FieldRenderer
                    field={field}
                    mode="display"
                    value={record.recordJson?.[field.fieldId]}
                    context={{ resolved: record.resolved }}
                  />
                </dd>
              </div>
            ))}
          </dl>
        </Link>
      ))}
    </div>
  );
}

export default RecordGridView;
