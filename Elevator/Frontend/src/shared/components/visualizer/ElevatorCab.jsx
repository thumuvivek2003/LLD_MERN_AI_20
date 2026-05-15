import clsx from 'clsx';
import { getElevatorColor } from '../../utils/elevatorColor.js';
import { formatFloor } from '../../utils/floorFormatter.js';
import DirectionIndicator from '../indicators/DirectionIndicator.jsx';

export default function ElevatorCab({ id, currentFloor, direction, floorHeight = 36 }) {
  const color = getElevatorColor(id);
  return (
    <div
      className={clsx(
        'absolute left-1/2 -translate-x-1/2 z-10 rounded-md flex flex-col items-center justify-center text-white shadow-lg transition-all duration-300 ease-in-out',
        color.bg
      )}
      style={{
        width: 56,
        height: floorHeight - 10,
        bottom: currentFloor * floorHeight + 5,
      }}
    >
      <div className="text-[10px] font-bold tracking-wider opacity-90">{id}</div>
      <div className="flex items-center gap-0.5 text-[10px] font-semibold">
        <DirectionIndicator direction={direction} size={10} />
        <span>{formatFloor(currentFloor)}</span>
      </div>
    </div>
  );
}
