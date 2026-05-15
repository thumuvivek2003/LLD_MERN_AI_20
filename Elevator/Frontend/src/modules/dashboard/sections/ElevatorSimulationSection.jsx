import ElevatorShaft from '../../../shared/components/visualizer/ElevatorShaft.jsx';
import HallCallPanel from '../../../shared/components/panels/HallCallPanel.jsx';
import CabinPanel from '../../../shared/components/panels/CabinPanel.jsx';
import { floorList, formatFloor } from '../../../shared/utils/floorFormatter.js';
import { useElevatorSimulation } from '../../elevator/hooks/useElevatorSimulation.js';

const FLOOR_HEIGHT = 44;

export default function ElevatorSimulationSection() {
  const { elevators, selectedElevatorId, selectElevator, submitHallCall, submitCabinRequest } = useElevatorSimulation();
  const floors = floorList(10);

  return (
    <div className="rounded-lg bg-slate-800/40 border border-slate-700/60 p-4">
      <div className="flex gap-4">
        <div className="flex flex-col text-[11px] text-slate-400 pt-1" style={{ gap: 0 }}>
          {floors.map((f) => (
            <div key={f} style={{ height: FLOOR_HEIGHT }} className="flex items-center justify-end pr-2 w-8">
              {formatFloor(f)}
            </div>
          ))}
        </div>
        <div className="flex gap-3 flex-1 justify-center">
          {elevators.map((e) => (
            <ElevatorShaft
              key={e.id}
              elevator={e}
              totalFloors={11}
              floorHeight={FLOOR_HEIGHT}
              onClick={selectElevator}
              selected={selectedElevatorId === e.id}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        <HallCallPanel onSubmit={submitHallCall} />
        <CabinPanel
          elevatorId={selectedElevatorId}
          onFloorPress={submitCabinRequest}
        />
      </div>
    </div>
  );
}
