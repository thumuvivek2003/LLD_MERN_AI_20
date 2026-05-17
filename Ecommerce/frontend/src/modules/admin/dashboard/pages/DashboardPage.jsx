import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../../../shared/components/PageHeader.jsx';
import Loader from '../../../../shared/components/Loader.jsx';
import StatsGrid from '../components/StatsGrid.jsx';
import OrdersByStatusGrid from '../components/OrdersByStatusGrid.jsx';
import OrderStatusBadge from '../../../order/components/OrderStatusBadge.jsx';
import { getAdminStats } from '../services/adminStats.service.js';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    blockedUsers: 0,
    totalCoupons: 0,
    activeCoupons: 0,
    revenue: 0,
    ordersByStatus: {},
  });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getAdminStats();
        const s = data.stats || {};
        setStats({
          totalOrders: s.totalOrders || 0,
          totalUsers: s.totalUsers || 0,
          blockedUsers: s.blockedUsers || 0,
          totalCoupons: s.totalCoupons || 0,
          activeCoupons: s.activeCoupons || 0,
          revenue: s.totalRevenue || 0,
          ordersByStatus: s.ordersByStatus || {},
        });
        setRecent(s.recentOrders || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loader full />;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your store" />
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
      <StatsGrid stats={stats} />
      <div className="mt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-3">Orders by Status</h3>
        <OrdersByStatusGrid ordersByStatus={stats.ordersByStatus} />
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-3">Recent Orders</h3>
        <div className="card overflow-x-auto p-0">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-600">
                <th className="px-4 py-3 font-semibold">Order ID</th>
                <th className="px-4 py-3 font-semibold">Items</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">View</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                recent.map((o, i) => (
                  <tr key={o._id} className={i % 2 ? 'bg-slate-50/40' : 'bg-white'}>
                    <td className="px-4 py-3 font-mono text-xs">{o._id}</td>
                    <td className="px-4 py-3">{o.items?.length || 0}</td>
                    <td className="px-4 py-3 font-semibold">₹{o.pricing?.total || 0}</td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/orders/${o._id}`}
                        className="text-brand text-sm font-semibold hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
