import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../../../shared/components/PageHeader.jsx';
import Loader from '../../../../shared/components/Loader.jsx';
import Button from '../../../../shared/components/Button.jsx';
import EmptyState from '../../../../shared/components/EmptyState.jsx';
import OrderStatusBadge from '../../../order/components/OrderStatusBadge.jsx';
import { getUserById, blockUser, unblockUser } from '../services/adminUsers.service.js';

export default function UserDetailsPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [assignedCoupons, setAssignedCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUserById(id);
      setUser(data.user);
      setOrders(data.orders || []);
      setAssignedCoupons(data.assignedCoupons || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function handleBlockToggle() {
    if (!user) return;
    setAction(true);
    setError('');
    try {
      if (user.blocked) {
        await unblockUser(user._id);
      } else {
        await blockUser(user._id);
      }
      await fetchAll();
    } catch (e) {
      setError(e.message);
    } finally {
      setAction(false);
    }
  }

  const totalSpent = useMemo(
    () =>
      orders
        .filter((o) => o.status !== 'CANCELLED')
        .reduce((sum, o) => sum + (o.pricing?.total || 0), 0),
    [orders],
  );

  if (loading) return <Loader full />;

  if (!user) {
    return (
      <div className="card">
        <p className="text-red-500">{error || 'User not found'}</p>
        <Link to="/admin/users" className="text-brand font-semibold mt-2 inline-block">
          Back to users
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/admin/users" className="text-sm text-slate-500 hover:text-brand mb-4 inline-block">
        ← Back to users
      </Link>
      <PageHeader title="User Details" subtitle={`User ID: ${user._id}`} />
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      <div className="card flex flex-wrap items-center gap-4 justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold">
            {(user.name || '?').slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="chip bg-slate-100 text-slate-700 capitalize">{user.role}</span>
              <span
                className={`chip ${
                  user.blocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}
              >
                {user.blocked ? 'Blocked' : 'Active'}
              </span>
            </div>
          </div>
        </div>
        {user.role !== 'admin' && (
          <Button
            variant={user.blocked ? 'secondary' : 'danger'}
            disabled={action}
            onClick={handleBlockToggle}
          >
            {user.blocked ? 'Unblock User' : 'Block User'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Orders</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{orders.length}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Total Spent</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">₹{totalSpent}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Assigned Coupons</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{assignedCoupons.length}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-3">Orders</h3>
        {orders.length === 0 ? (
          <EmptyState title="No orders" message="This user hasn't placed any orders yet." icon="📦" />
        ) : (
          <div className="card overflow-x-auto p-0">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-600">
                  <th className="px-4 py-3 font-semibold">Order ID</th>
                  <th className="px-4 py-3 font-semibold">Items</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Payment</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">View</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o._id} className={i % 2 ? 'bg-slate-50/40' : 'bg-white'}>
                    <td className="px-4 py-3 font-mono text-xs">{o._id}</td>
                    <td className="px-4 py-3">{o.items?.length || 0}</td>
                    <td className="px-4 py-3 font-semibold">₹{o.pricing?.total || 0}</td>
                    <td className="px-4 py-3 uppercase text-xs font-semibold">{o.payment?.type}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-3">Assigned Coupons</h3>
        {assignedCoupons.length === 0 ? (
          <EmptyState
            title="No assigned coupons"
            message="This user has no personally-assigned coupons."
            icon="🎟️"
          />
        ) : (
          <div className="card overflow-x-auto p-0">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-600">
                  <th className="px-4 py-3 font-semibold">Code</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Value</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {assignedCoupons.map((c, i) => (
                  <tr key={c._id} className={i % 2 ? 'bg-slate-50/40' : 'bg-white'}>
                    <td className="px-4 py-3 font-mono font-semibold text-brand-dark">{c.code}</td>
                    <td className="px-4 py-3 capitalize">{c.type.replace('_', ' ')}</td>
                    <td className="px-4 py-3">
                      {c.type === 'percentage'
                        ? `${c.value}%`
                        : c.type === 'flat'
                        ? `₹${c.value}`
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`chip ${
                          c.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {c.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
