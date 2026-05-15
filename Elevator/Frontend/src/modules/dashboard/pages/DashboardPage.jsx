import { useDashboardData } from '../hooks/useDashboardData.js';
import ElevatorSimulationSection from '../sections/ElevatorSimulationSection.jsx';
import ActiveRequestsSection from '../sections/ActiveRequestsSection.jsx';
import ElevatorStatusSection from '../sections/ElevatorStatusSection.jsx';
import EventLogsSection from '../sections/EventLogsSection.jsx';
import SimulationControlPanel from '../../../shared/components/panels/SimulationControlPanel.jsx';
import ElevatorCab from '../../../shared/components/visualizer/ElevatorCab.jsx';
import { useElevatorSimulation } from '../../elevator/hooks/useElevatorSimulation.js';
import { getElevatorColor } from '../../../shared/utils/elevatorColor.js';
import { formatFloor } from '../../../shared/utils/floorFormatter.js';
import clsx from 'clsx';

export default function DashboardPage() {
  useDashboardData();
  const { selected } = useElevatorSimulation();
  const color = selected ? getElevatorColor(selected.id) : null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
      <div className="space-y-4">
        <ElevatorSimulationSection />
        <ElevatorStatusSection />
        <EventLogsSection height={180} />
      </div>

      <div className="space-y-4">
        <ActiveRequestsSection />

        {selected && (
          <div className="rounded-lg bg-slate-800/60 border border-slate-700/60 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className={clsx('text-[11px] font-semibold tracking-wider', color?.text)}>ELEVATOR {selected.id}</span>
              <span className="text-[11px] flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot" /> {selected.online ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="flex gap-3">
              <div className="relative bg-slate-900/60 rounded-md border border-slate-700/60 overflow-hidden" style={{ width: 64, height: 132 }}>
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={i} className="border-b border-slate-800/60" style={{ height: 12 }} />
                ))}
                <ElevatorCab id={selected.id} currentFloor={selected.currentFloor} direction={selected.direction} state={selected.state} totalFloors={11} floorHeight={12} />
              </div>
              <div className="flex-1 text-xs">
                <div className="text-slate-400">Current Floor</div>
                <div className="text-xl font-bold mb-2">{formatFloor(selected.currentFloor)}</div>
                <div className="text-slate-400">Next Stop</div>
                <div className="text-sm font-semibold mb-2">{selected.nextStop != null ? formatFloor(selected.nextStop) : '—'}</div>
                <div className="text-slate-400">Queue</div>
                <div className="text-sm">{selected.queue?.length ? selected.queue.map(formatFloor).join(', ') : 'Empty'}</div>
              </div>
            </div>
          </div>
        )}

        <SimulationControlPanel />
      </div>
    </div>
  );
}
