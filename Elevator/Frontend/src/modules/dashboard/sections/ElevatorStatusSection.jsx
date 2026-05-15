import ElevatorCard from '../../../shared/components/cards/ElevatorCard.jsx';
import { useElevatorSimulation } from '../../elevator/hooks/useElevatorSimulation.js';

export default function ElevatorStatusSection() {
  const { elevators, selectedElevatorId, selectElevator } = useElevatorSimulation();
  return (
    <div>
      <div className="text-[11px] font-semibold tracking-wider text-slate-400 mb-2">ELEVATOR STATUS</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {elevators.map((e) => (
          <ElevatorCard key={e.id} elevator={e} selected={e.id === selectedElevatorId} onClick={selectElevator} />
        ))}
      </div>
    </div>
  );
}
