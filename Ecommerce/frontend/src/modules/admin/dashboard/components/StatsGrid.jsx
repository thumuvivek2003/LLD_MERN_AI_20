import DashboardCard from './DashboardCard.jsx';

export default function StatsGrid({ stats }) {
  const totalUsersLabel =
    stats.blockedUsers > 0
      ? `${stats.totalUsers} (${stats.blockedUsers} blocked)`
      : stats.totalUsers;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardCard
        label="Total Orders"
        value={stats.totalOrders}
        icon="📦"
        accent="bg-indigo-100 text-indigo-700"
      />
      <DashboardCard
        label="Total Users"
        value={totalUsersLabel}
        icon="👥"
        accent="bg-emerald-100 text-emerald-700"
      />
      <DashboardCard
        label="Active Coupons"
        value={stats.activeCoupons}
        icon="🎟️"
        accent="bg-amber-100 text-amber-700"
      />
      <DashboardCard
        label="Total Revenue"
        value={`₹${stats.revenue}`}
        icon="💰"
        accent="bg-violet-100 text-violet-700"
      />
    </div>
  );
}
