import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

const STATS = [
  { label: 'Active Slots', value: '24', delta: '+3', tone: 'brand' },
  { label: 'Vehicles In', value: '1,248', delta: '+12%', tone: 'success' },
  { label: 'Today Revenue', value: formatCurrency(84500), delta: '+₹4.2k', tone: 'info' },
  { label: 'Lots Online', value: '06', delta: 'all live', tone: 'success' },
];

export function DashboardPage() {
  return (
    <PageContainer
      title="Dashboard"
      subtitle="Overview of all parking activity for today"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <Card key={s.label}>
            <p className="text-xs uppercase tracking-wide text-ink-500">{s.label}</p>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-2xl font-semibold text-ink-900">{s.value}</p>
              <Badge tone={s.tone}>{s.delta}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-ink-900">Occupancy — Today</h3>
              <p className="text-sm text-ink-500">Hourly slot usage across all lots</p>
            </div>
            <Badge tone="brand">Live</Badge>
          </div>
          <div className="flex h-56 items-end gap-2">
            {[42, 58, 64, 71, 80, 76, 88, 92, 84, 78, 70, 55].map((v, i) => (
              <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-brand-200 to-brand-600" style={{ height: `${v}%` }} />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-ink-500">
            <span>8AM</span><span>12PM</span><span>4PM</span><span>8PM</span>
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-ink-900">Slot Mix</h3>
          <p className="mb-4 text-sm text-ink-500">By vehicle type</p>
          <ul className="space-y-3">
            {[
              { label: 'Cars', pct: 64, color: 'bg-brand-600' },
              { label: 'Bikes', pct: 24, color: 'bg-emerald-500' },
              { label: 'Trucks', pct: 8, color: 'bg-amber-500' },
              { label: 'EV', pct: 4, color: 'bg-sky-500' },
            ].map((row) => (
              <li key={row.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-ink-700">{row.label}</span>
                  <span className="text-ink-500">{row.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                  <div className={`h-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}
