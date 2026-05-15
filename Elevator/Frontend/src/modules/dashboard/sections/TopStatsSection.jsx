import { Users, ListChecks, BarChart3, Gauge } from 'lucide-react';
import StatCard from '../../../shared/components/cards/StatCard.jsx';
import { useElevatorStore } from '../../elevator/store/elevator.store.js';

export default function TopStatsSection() {
  const stats = useElevatorStore((s) => s.stats);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard label="People Inside" value={stats.peopleInside ?? 0} icon={Users} accent="text-indigo-300" />
      <StatCard label="Active Requests" value={stats.activeRequests ?? 0} icon={ListChecks} accent="text-emerald-300" />
      <StatCard label="Total Requests" value={stats.totalRequests ?? 0} icon={BarChart3} accent="text-amber-300" />
      <StatCard label="Efficiency" value={`${stats.efficiency ?? 0}%`} icon={Gauge} accent="text-rose-300" />
    </div>
  );
}
