import { Activity } from 'lucide-react';
import { EVENT_FAMILY_TONE } from '../../../shared/enums/event-type.enum.js';
import { DOTS } from '../../../core/components/ui/Badge.jsx';
import { EmptyState, ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import { formatTime } from '../../../core/utils/formatters.js';
import cx from '../../../core/utils/cx.js';

const toneOf = (type = '') => EVENT_FAMILY_TONE[type.split('.')[0]] || 'slate';

/** Live event feed from `GET /system/events` — dashboard panel and Event Monitor page. */
export function EventStream({ events = [], loading, error, onRetry, className }) {
  if (loading) return <SkeletonText lines={7} className="p-5" />;
  if (error) return <ErrorState error={error} onRetry={onRetry} compact />;
  if (!events.length) {
    return <EmptyState icon={Activity} title="No events yet" description="The bus is quiet." compact />;
  }

  return (
    <ul className={cx('divide-y divide-slate-50', className)}>
      {events.map((event) => (
        <li key={event.eventId} className="flex items-center gap-3 px-5 py-2.5">
          <span className={cx('h-1.5 w-1.5 shrink-0 rounded-full', DOTS[toneOf(event.type)])} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-slate-800">{event.type}</span>
            {event.payloadSummary && (
              <span className="block truncate text-[11px] text-slate-400">{event.payloadSummary}</span>
            )}
          </span>
          <span className="hidden shrink-0 text-xs text-slate-500 sm:block">{event.objectLabel}</span>
          <span className="shrink-0 text-[11px] text-slate-400">{formatTime(event.at)}</span>
        </li>
      ))}
    </ul>
  );
}

export default EventStream;
