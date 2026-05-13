import AnalyticsCard from '../components/AnalyticsCard.jsx';
import Card from '../../../core/components/ui/Card.jsx';
import { useAnalytics } from '../hooks/useAnalytics.js';
import { formatCurrency } from '../../../core/utils/formatCurrency.js';
import Loader from '../../../core/components/ui/Loader.jsx';

export default function AnalyticsPage() {
  const { data, loading } = useAnalytics();
  if (loading) return <Loader />;
  const d = data || {};
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Analytics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnalyticsCard label="Riders" value={d.riders ?? 0} icon="🧍" />
        <AnalyticsCard label="Drivers" value={d.drivers ?? 0} icon="🚖" tone="emerald" />
        <AnalyticsCard label="Rides" value={d.rides ?? 0} icon="🛣️" tone="amber" />
        <AnalyticsCard label="Revenue" value={formatCurrency(d.totalRevenue)} icon="💰" tone="rose" />
      </div>
      <Card>
        <p className="font-semibold">Performance snapshot</p>
        <ul className="mt-3 divide-y divide-slate-100 text-sm">
          <li className="py-2 flex justify-between"><span>Completed rides</span><span className="font-semibold">{d.completed ?? 0}</span></li>
          <li className="py-2 flex justify-between"><span>Active drivers</span><span className="font-semibold">{d.activeDrivers ?? 0}</span></li>
          <li className="py-2 flex justify-between"><span>Average fare</span><span className="font-semibold">{d.completed ? formatCurrency((d.totalRevenue || 0) / d.completed) : formatCurrency(0)}</span></li>
        </ul>
      </Card>
    </div>
  );
}
