import clsx from 'clsx';
import { useElevatorStore, storeActions } from '../../elevator/store/elevator.store.js';
import { setSimulationConfig } from '../../elevator/services/elevatorApi.service.js';
import { notify } from '../../../shared/services/notificationService.js';

const STRATEGIES = [
  { id: 'NEAREST', label: 'Nearest', description: 'Pick the elevator closest to the requested floor.' },
  { id: 'SAME_DIRECTION', label: 'Same Direction', description: 'Prefer elevators already moving in the request direction.' },
  { id: 'LEAST_BUSY', label: 'Least Busy', description: 'Pick the elevator with the smallest queue.' },
];

export default function StrategySelector() {
  const current = useElevatorStore((s) => s.strategy);

  const choose = async (id) => {
    storeActions.setStrategy(id);
    try { await setSimulationConfig({ strategy: id }); } catch { notify.warn('Strategy not persisted on server'); }
  };

  return (
    <div className="space-y-2">
      <div className="text-[11px] font-semibold tracking-wider text-slate-400">DISPATCH STRATEGY</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {STRATEGIES.map((s) => (
          <button
            key={s.id}
            onClick={() => choose(s.id)}
            className={clsx(
              'text-left p-3 rounded-md border transition',
              current === s.id
                ? 'border-indigo-500/60 bg-indigo-500/10'
                : 'border-slate-700/60 bg-slate-800/60 hover:bg-slate-800'
            )}
          >
            <div className="text-sm font-semibold text-slate-100">{s.label}</div>
            <div className="text-[11px] text-slate-400 mt-1">{s.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
