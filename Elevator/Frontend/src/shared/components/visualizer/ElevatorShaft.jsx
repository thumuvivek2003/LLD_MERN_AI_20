import clsx from 'clsx';
import FloorLane from './FloorLane.jsx';
import ElevatorCab from './ElevatorCab.jsx';
import { getElevatorColor } from '../../utils/elevatorColor.js';

export default function ElevatorShaft({ elevator, totalFloors = 11, floorHeight = 36, onClick, selected = false }) {
  const color = getElevatorColor(elevator.id);
  return (
    <button
      type="button"
      onClick={() => onClick && onClick(elevator.id)}
      className={clsx(
        'relative rounded-md bg-slate-800/40 border w-20 overflow-hidden transition',
        color.border,
        selected ? `ring-2 ${color.ring}` : 'hover:bg-slate-800/60'
      )}
      style={{ height: totalFloors * floorHeight }}
    >
      {Array.from({ length: totalFloors }).map((_, i) => (
        <FloorLane
          key={i}
          floorHeight={floorHeight}
          isLast={i === totalFloors - 1}
        />
      ))}
      <ElevatorCab
        id={elevator.id}
        currentFloor={elevator.currentFloor}
        direction={elevator.direction}
        state={elevator.state}
        totalFloors={totalFloors}
        floorHeight={floorHeight}
      />
      <div className={clsx('absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded', color.soft, color.text)}>{elevator.id}</div>
    </button>
  );
}
