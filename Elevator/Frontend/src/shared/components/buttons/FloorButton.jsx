import clsx from 'clsx';
import { formatFloor } from '../../utils/floorFormatter.js';

export default function FloorButton({ floor, onClick, selected = false, disabled = false, size = 'md' }) {
  return (
    <button
      onClick={() => onClick && onClick(floor)}
      disabled={disabled}
      className={clsx(
        'rounded-md font-semibold transition border',
        size === 'sm' ? 'w-9 h-9 text-xs' : 'w-11 h-11 text-sm',
        selected
          ? 'bg-indigo-500 text-white border-indigo-400 shadow-md shadow-indigo-500/30'
          : 'bg-slate-800/70 border-slate-700/60 text-slate-200 hover:bg-slate-700',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {formatFloor(floor)}
    </button>
  );
}
