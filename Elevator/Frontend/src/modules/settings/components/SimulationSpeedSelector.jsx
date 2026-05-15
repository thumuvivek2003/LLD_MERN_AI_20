import clsx from 'clsx';
import { useSimulation } from '../../../shared/hooks/useSimulation.js';

const SPEEDS = [0.25, 0.5, 1, 2];

export default function SimulationSpeedSelector() {
  const { simulation, setSpeed } = useSimulation();
  return (
    <div className="space-y-2">
      <div className="text-[11px] font-semibold tracking-wider text-slate-400">SIMULATION SPEED</div>
      <div className="flex gap-2">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={clsx(
              'px-3 py-1.5 rounded-md text-sm font-semibold border',
              simulation.speed === s
                ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-200'
                : 'border-slate-700 text-slate-300 hover:bg-slate-800'
            )}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
