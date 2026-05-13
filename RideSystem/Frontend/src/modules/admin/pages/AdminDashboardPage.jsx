import AnalyticsCard from '../components/AnalyticsCard.jsx';
import Card from '../../../core/components/ui/Card.jsx';
import { useAnalytics } from '../hooks/useAnalytics.js';
import { formatCurrency } from '../../../core/utils/formatCurrency.js';
import Loader from '../../../core/components/ui/Loader.jsx';

export default function AdminDashboardPage() {
  const { data, loading } = useAnalytics();
  if (loading) return <Loader />;
  const d = data || {};

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnalyticsCard label="Total Riders" value={d.riders ?? 0} icon="🧍" tone="indigo" />
        <AnalyticsCard label="Total Drivers" value={d.drivers ?? 0} icon="🚖" tone="emerald" />
        <AnalyticsCard label="Total Rides" value={d.rides ?? 0} icon="🛣️" tone="amber" />
        <AnalyticsCard label="Revenue" value={formatCurrency(d.totalRevenue)} icon="💰" tone="rose" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <p className="text-xs text-slate-500">Active drivers right now</p>
          <p className="text-3xl font-bold mt-1">{d.activeDrivers ?? 0}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500">Completed rides</p>
          <p className="text-3xl font-bold mt-1">{d.completed ?? 0}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500">Avg fare</p>
          <p className="text-3xl font-bold mt-1">
            {d.completed ? formatCurrency((d.totalRevenue || 0) / d.completed) : formatCurrency(0)}
          </p>
        </Card>
      </div>
    </div>
  );
}
