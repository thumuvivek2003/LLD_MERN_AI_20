import RequestCard from '../../../shared/components/cards/RequestCard.jsx';
import { useElevatorStore } from '../../elevator/store/elevator.store.js';

export default function ActiveRequestsSection() {
  const requests = useElevatorStore((s) => s.requests);
  const active = requests.filter((r) => r.status !== 'COMPLETED').slice(0, 6);
  return (
    <div className="rounded-lg bg-slate-800/60 border border-slate-700/60 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400">ACTIVE REQUESTS</span>
        <span className="text-[10px] text-indigo-300">View All</span>
      </div>
      <div className="space-y-2 max-h-72 overflow-auto pr-1">
        {active.length === 0 ? (
          <div className="text-[11px] text-slate-500 py-2">No active requests.</div>
        ) : (
          active.map((r) => <RequestCard key={r.id} request={r} />)
        )}
      </div>
    </div>
  );
}
