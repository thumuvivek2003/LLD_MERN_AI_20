import { Card } from '../../../components/ui/Card.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { formatLotAddress } from '../utils/lotFormatters.js';

export function LotListItem({ lot, onSelect }) {
  if (!lot) return null;
  const floorCount = Array.isArray(lot.floors) ? lot.floors.length : lot.floors ?? 0;
  const slotCount = Array.isArray(lot.floors)
    ? lot.floors.reduce((sum, f) => sum + (f.slots?.length || 0), 0)
    : lot.totalSlots ?? 0;

  return (
    <Card
      className="cursor-pointer transition hover:-translate-y-0.5 hover:shadow-soft"
      as="div"
    >
      <button
        type="button"
        onClick={() => onSelect?.(lot)}
        className="block w-full text-left"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-ink-900">{lot.name}</h3>
            <p className="mt-1 text-sm text-ink-500">{formatLotAddress(lot)}</p>
          </div>
          <Badge tone="brand">Active</Badge>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-center text-xs">
          <div className="rounded-lg bg-ink-50 p-2.5">
            <p className="text-ink-500">Floors</p>
            <p className="text-base font-semibold text-ink-900">{floorCount || '—'}</p>
          </div>
          <div className="rounded-lg bg-ink-50 p-2.5">
            <p className="text-ink-500">Slots</p>
            <p className="text-base font-semibold text-ink-900">{slotCount || '—'}</p>
          </div>
        </div>
      </button>
    </Card>
  );
}
