import { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { DIRECTION } from '../../constants/direction.js';
import { floorList, formatFloor } from '../../utils/floorFormatter.js';

export default function HallCallPanel({ onSubmit }) {
  const [floor, setFloor] = useState(0);
  const floors = floorList(10);

  const submit = (direction) => {
    onSubmit && onSubmit(floor, direction);
  };

  return (
    <div className="rounded-lg bg-slate-800/60 border border-slate-700/60 p-3">
      <div className="text-[11px] font-semibold tracking-wider text-slate-400 mb-2">HALL CALL (OUTSIDE)</div>
      <div className="flex items-start gap-3">
        <select
          value={floor}
          onChange={(e) => setFloor(Number(e.target.value))}
          className="bg-slate-900 border border-slate-700 rounded-md text-sm px-2 py-1.5 text-slate-100"
        >
          {floors.map((f) => (
            <option key={f} value={f}>{`Floor ${formatFloor(f)}`}</option>
          ))}
        </select>
        <button
          onClick={() => submit(DIRECTION.UP)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold"
        >
          <ArrowUp className="w-3.5 h-3.5" /> UP
        </button>
        <button
          onClick={() => submit(DIRECTION.DOWN)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold"
        >
          <ArrowDown className="w-3.5 h-3.5" /> DOWN
        </button>
      </div>
    </div>
  );
}
