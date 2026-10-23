import { Badge } from '../ui/Badge.jsx';
import { SlotStatus, StatusTone } from '../../constants/statuses.js';

const STATUS_LABEL = {
  [SlotStatus.AVAILABLE]: 'Available',
  [SlotStatus.OCCUPIED]: 'Occupied',
  [SlotStatus.MAINTENANCE]: 'Maintenance',
};

export function SlotCard({ slot, onClick }) {
  if (!slot) return null;
  const status = slot.status || SlotStatus.AVAILABLE;
  const isClickable = typeof onClick === 'function';

  return (
    <button
      type="button"
      onClick={isClickable ? () => onClick(slot) : undefined}
      disabled={!isClickable}
      className={[
        'flex w-full flex-col items-start gap-2 rounded-2xl border bg-white p-4 text-left shadow-card transition',
        isClickable ? 'hover:-translate-y-0.5 hover:shadow-soft' : 'cursor-default',
        status === SlotStatus.OCCUPIED ? 'border-red-100' : '',
        status === SlotStatus.AVAILABLE ? 'border-emerald-100' : '',
        status === SlotStatus.MAINTENANCE ? 'border-amber-100' : 'border-ink-100',
      ].join(' ')}
    >
      <div className="flex w-full items-center justify-between">
        <span className="font-mono text-sm font-semibold text-ink-900">
          {slot.code || slot.label || `S-${slot.number || slot.id}`}
        </span>
        <Badge tone={StatusTone[status]}>{STATUS_LABEL[status]}</Badge>
      </div>
      <div className="text-xs text-ink-500">
        {slot.vehicleType ? <span>Type: {slot.vehicleType}</span> : null}
        {slot.floor ? <span className="ml-2">Floor {slot.floor}</span> : null}
      </div>
    </button>
  );
}
