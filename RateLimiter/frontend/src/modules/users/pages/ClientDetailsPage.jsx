import { Link, useParams } from 'react-router-dom';
import { useClientDetails } from '../hooks/useUsers.js';
import { Loader } from '../../shared/components/Loader.jsx';
import { EmptyState } from '../../shared/components/EmptyState.jsx';
import { UserStatusBadge } from '../components/UserStatusBadge.jsx';
import { UsageHistoryChart } from '../components/UsageHistoryChart.jsx';
import { StatsCard } from '../../dashboard/components/StatsCard.jsx';
import { ROUTES } from '../../shared/constants/routes.js';
import { formatRelative } from '../../shared/utils/format.util.js';

export function ClientDetailsPage() {
  const { clientId } = useParams();
  const { details, loading, error } = useClientDetails(clientId);

  if (loading) return <Loader />;
  if (error) {
    return <EmptyState title="Could not load client" description={error} />;
  }
  if (!details) {
    return <EmptyState title="Client not found" />;
  }

  const { client = {}, stats = {}, history = [] } = details;

  const buckets = new Map();
  history.forEach((h) => {
    const key = new Date(h.at).toISOString().slice(0, 16);
    if (!buckets.has(key))
      buckets.set(key, { label: key.slice(11), value: 0 });
    buckets.get(key).value += 1;
  });
  const chartData = Array.from(buckets.values()).slice(-12);

  return (
    <div className="space-y-6">
      <Link
        to={ROUTES.ADMIN_CLIENTS}
        className="text-xs text-brand-600 hover:underline"
      >
        &lt; Back to clients
      </Link>

      <div className="card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-800">
                {client.username || client.clientId}
              </h2>
              <UserStatusBadge status={client.status} />
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {client.clientId} - last seen {formatRelative(client.lastSeen)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          label="Requests"
          value={stats.requests}
          tone="brand"
        />
        <StatsCard label="Allowed" value={stats.allowed} tone="green" />
        <StatsCard label="Blocked" value={stats.blocked} tone="red" />
      </div>

      <div className="card p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Usage History</h3>
        <UsageHistoryChart data={chartData} />
      </div>
    </div>
  );
}

export default ClientDetailsPage;
