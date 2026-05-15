import { DoorOpen, DoorClosed } from 'lucide-react';
import FloorButton from '../buttons/FloorButton.jsx';
import IconButton from '../buttons/IconButton.jsx';

export default function CabinPanel({ elevatorId, onFloorPress, onDoorOpen, onDoorClose }) {
  const floors = [];
  for (let i = 10; i >= 1; i--) floors.push(i);
  floors.push(0);

  return (
    <div className="rounded-lg bg-slate-800/60 border border-slate-700/60 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400">CABIN PANEL (INSIDE)</span>
        <span className="text-[11px] text-indigo-300 font-semibold">{elevatorId || '—'}</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {floors.map((f) => (
          <FloorButton key={f} floor={f} size="sm" disabled={!elevatorId} onClick={() => onFloorPress && onFloorPress(elevatorId, f)} />
        ))}
      </div>
      <div className="mt-2 flex gap-1.5">
        <IconButton icon={DoorOpen} label="Open" onClick={onDoorOpen} disabled={!elevatorId} className="flex-1 !py-1.5 !text-xs" />
        <IconButton icon={DoorClosed} label="Close" onClick={onDoorClose} disabled={!elevatorId} className="flex-1 !py-1.5 !text-xs" />
      </div>
    </div>
  );
}
