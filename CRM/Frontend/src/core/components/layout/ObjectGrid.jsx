import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { objectColorClass, resolveIcon } from '../../utils/icons.js';
import { formatCompact, formatDate } from '../../utils/formatters.js';
import StatusPill from '../ui/StatusPill.jsx';
import { EmptyState, ErrorState } from '../ui/EmptyState.jsx';
import { SkeletonCards } from '../ui/Skeleton.jsx';
import cx from '../../utils/cx.js';

/**
 * Card grid of objects — used by Admin → Records (pick an object) and
 * Business → My Objects / Favorites / Recent.
 */
export function ObjectGrid({
  objects = [],
  loading,
  error,
  onRetry,
  linkTo,
  showStatus = false,
  emptyTitle = 'No objects available',
  emptyDescription,
  emptyAction,
  action,
}) {
  if (loading) return <SkeletonCards count={6} />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (!objects.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {objects.map((object) => {
        const Icon = resolveIcon(object.icon);
        return (
          <Link
            key={object.objectId}
            to={linkTo(object)}
            className="mf-card group flex flex-col gap-3 p-4 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-pop"
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className={cx(
                  'flex h-10 w-10 items-center justify-center rounded-xl ring-1',
                  objectColorClass(object.color),
                )}
              >
                <Icon size={19} />
              </span>
              {showStatus ? (
                <StatusPill kind="object" status={object.status} />
              ) : (
                <ArrowRight
                  size={16}
                  className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-accent"
                />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold text-slate-900">
                {object.pluralLabel || object.label}
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                {object.description || 'No description'}
              </p>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
              <span>
                <span className="font-bold text-slate-700">{formatCompact(object.recordCount)}</span> records
              </span>
              <span>{object.updatedAt ? formatDate(object.updatedAt) : `${object.fieldCount ?? 0} fields`}</span>
            </div>

            {action && <div onClick={(event) => event.preventDefault()}>{action(object)}</div>}
          </Link>
        );
      })}
    </div>
  );
}

export default ObjectGrid;
