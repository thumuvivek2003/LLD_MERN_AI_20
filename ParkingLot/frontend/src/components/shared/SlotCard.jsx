import { Badge } from '../ui/Badge.jsx';
import { SlotStatus } from '../../constants/statuses.js';

const toneFor = (status) => {
  if (status === SlotStatus.AVAILABLE) return 'success';
  if (status === SlotStatus.OCCUPIED) return 'danger';
  return 'warning';
};

export const SlotCard = ({ slot, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col items-start rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-brand-400 hover:shadow"
  >
    <div className="text-xs uppercase text-slate-500">Floor {slot.floorNumber} • Slot</div>
    <div className="text-lg font-semibold text-slate-900">#{slot.slotNumber}</div>
    <div className="mt-2 flex items-center gap-2">
      <Badge tone="default">{slot.vehicleType}</Badge>
      <Badge tone={toneFor(slot.status)}>{slot.status}</Badge>
    </div>
  </button>
);
