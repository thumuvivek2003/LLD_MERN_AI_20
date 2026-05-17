import { useEffect } from 'react';
import { useAdmin } from '../hooks/useAdmin.js';
import { StatsCard } from '../components/StatsCard.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';

export function DashboardPage() {
  const { stats, loading, loadStats } = useAdmin();

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading && !stats) return <Loader label="Loading dashboard" />;

  return (
    <div className="p-6">
      <h1 className="mb-1 text-xl font-semibold text-wa-dark">Dashboard</h1>
      <p className="mb-6 text-sm text-wa-muted">
        Real-time chat platform overview.
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatsCard title="Total users" value={stats?.totalUsers} />
        <StatsCard title="Online now" value={stats?.onlineUsers} />
        <StatsCard title="Total chats" value={stats?.totalChats} />
        <StatsCard title="Total groups" value={stats?.totalGroups} />
        <StatsCard title="Messages today" value={stats?.messagesToday} />
      </div>
    </div>
  );
}
