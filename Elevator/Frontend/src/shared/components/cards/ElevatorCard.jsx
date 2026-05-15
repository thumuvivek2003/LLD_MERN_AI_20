import clsx from 'clsx';
import { getElevatorColor } from '../../utils/elevatorColor.js';
import { formatFloor } from '../../utils/floorFormatter.js';
import DirectionIndicator from '../indicators/DirectionIndicator.jsx';
import ElevatorStateBadge from '../indicators/ElevatorStateBadge.jsx';

export default function ElevatorCard({
  elevator,
  selected = false,
  onClick,
}) {
  const color = getElevatorColor(elevator.id);

  const queue = elevator.queue || [];

  return (
    <button
      onClick={() => onClick && onClick(elevator.id)}
      className={clsx(
        'text-left w-full rounded-lg p-3 border bg-slate-800/60 transition',
        color.border,
        selected ? `ring-2 ${color.ring}` : 'hover:bg-slate-800'
      )}
    >
      <div className="flex items-center justify-between">
        <span className={clsx('text-xs font-bold', color.text)}>
          {elevator.id}
        </span>

        <DirectionIndicator
          direction={elevator.direction}
          size={14}
        />
      </div>

      <div className="mt-2 flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold leading-none">
            {formatFloor(elevator.currentFloor)}
          </div>

          <div className="text-[10px] text-slate-400 mt-1">
            Queue Count: {queue.length}
          </div>

          {/* Queue List */}
          <div className="mt-2 flex flex-wrap gap-1">
            {queue.length > 0 ? (
              queue.map((floor, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 rounded bg-slate-700 text-[10px] text-slate-200"
                >
                  {formatFloor(floor)}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-500">
                No queue
              </span>
            )}
          </div>
        </div>

        <ElevatorStateBadge state={elevator.state} />
      </div>
    </button>
  );
}