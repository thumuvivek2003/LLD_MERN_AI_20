import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useElevatorStore } from '../store/elevator.store.js';
import { getElevatorColor } from '../../../shared/utils/elevatorColor.js';
import { formatFloor } from '../../../shared/utils/floorFormatter.js';
import ElevatorStateBadge from '../../../shared/components/indicators/ElevatorStateBadge.jsx';
import DirectionIndicator from '../../../shared/components/indicators/DirectionIndicator.jsx';
import ElevatorCab from '../../../shared/components/visualizer/ElevatorCab.jsx';
import clsx from 'clsx';

export default function ElevatorDetailsPage() {
  const { id } = useParams();
  const elevator = useElevatorStore((s) => s.elevators.find((e) => e.id === id));
  if (!elevator) {
    return <div className="text-slate-400 text-sm">Elevator {id} not found.</div>;
  }
  const color = getElevatorColor(id);

  return (
    <div className="space-y-4">
      <Link to="/elevators" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200">
        <ArrowLeft className="w-4 h-4" /> Back to elevators
      </Link>

      <div className={clsx('rounded-lg bg-slate-800/60 border p-4', color.border)}>
        <div className="flex items-center justify-between mb-3">
          <h2 className={clsx('text-lg font-semibold', color.text)}>Elevator {id}</h2>
          <ElevatorStateBadge state={elevator.state} />
        </div>
        <div className="flex gap-6">
          <div className="relative bg-slate-900/60 rounded-md border border-slate-700/60 overflow-hidden" style={{ width: 80, height: 220 }}>
            {Array.from({ length: 11 }).map((_, i) => (
              <div key={i} className="border-b border-slate-800/60" style={{ height: 20 }} />
            ))}
            <ElevatorCab id={id} currentFloor={elevator.currentFloor} direction={elevator.direction} state={elevator.state} totalFloors={11} floorHeight={20} />
          </div>
          <div className="text-sm space-y-2">
            <Row label="Current Floor" value={formatFloor(elevator.currentFloor)} />
            <Row label="Direction" value={<span className="inline-flex items-center gap-1"><DirectionIndicator direction={elevator.direction} size={14} />{elevator.direction}</span>} />
            <Row label="Next Stop" value={elevator.nextStop != null ? formatFloor(elevator.nextStop) : '—'} />
            <Row label="Queue" value={elevator.queue?.length ? elevator.queue.map(formatFloor).join(', ') : 'Empty'} />
            <Row label="People Inside" value={elevator.peopleInside ?? 0} />
            <Row label="Online" value={elevator.online ? 'Yes' : 'No'} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex gap-3">
      <span className="w-28 text-slate-400">{label}</span>
      <span className="font-medium text-slate-100">{value}</span>
    </div>
  );
}
