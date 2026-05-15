import { Link } from 'react-router-dom';
import ElevatorCard from '../../../shared/components/cards/ElevatorCard.jsx';
import { useElevatorSimulation } from '../hooks/useElevatorSimulation.js';

export default function ElevatorSimulationPage() {
  const { elevators } = useElevatorSimulation();
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Elevators</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {elevators.map((e) => (
          <Link key={e.id} to={`/elevators/${e.id}`}>
            <ElevatorCard elevator={e} />
          </Link>
        ))}
      </div>
    </div>
  );
}
