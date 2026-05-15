import { Play, Pause, RotateCcw } from 'lucide-react';
import SimulationControlButton from '../buttons/SimulationControlButton.jsx';
import { useSimulation } from '../../hooks/useSimulation.js';
import { SIMULATION_STATUS } from '../../constants/simulationStatus.js';

const SPEEDS = [0.25, 0.5, 1, 2];

export default function SimulationControlPanel() {
  const { simulation, play, pause, reset, setSpeed } = useSimulation();

  return (
    <div className="rounded-lg bg-slate-800/60 border border-slate-700/60 p-3">
      <div className="text-[11px] font-semibold tracking-wider text-slate-400 mb-2">SIMULATION CONTROLS</div>
      <div className="flex items-center gap-2 flex-wrap">
        <SimulationControlButton icon={Play} label="Play" tone="play" onClick={play} active={simulation.status === SIMULATION_STATUS.RUNNING} />
        <SimulationControlButton icon={Pause} label="Pause" tone="pause" onClick={pause} active={simulation.status === SIMULATION_STATUS.PAUSED} />
        <SimulationControlButton icon={RotateCcw} label="Reset" tone="reset" onClick={reset} />
        <div className="flex items-center gap-1 ml-auto">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                simulation.speed === s
                  ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-200'
                  : 'border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
