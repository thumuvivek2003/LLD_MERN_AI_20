import { useCallback, useEffect, useMemo, useState } from 'react';
import PageHeader from '../../../../shared/components/PageHeader.jsx';
import Loader from '../../../../shared/components/Loader.jsx';
import EmptyState from '../../../../shared/components/EmptyState.jsx';
import OrdersTable from '../components/OrdersTable.jsx';
import { ORDER_STATUS_LIST } from '../../../../shared/constants/orderStatus.constants.js';
import { getAllOrders, updateOrderStatus } from '../services/adminOrders.service.js';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllOrders();
      setOrders(data.orders || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function handleStatusChange(id, status) {
    setAction(true);
    setError('');
    try {
      await updateOrderStatus(id, status);
      await fetchAll();
    } catch (e) {
      setError(e.message);
    } finally {
      setAction(false);
    }
  }

  const filtered = useMemo(() => {
    if (statusFilter === 'ALL') return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  if (loading) return <Loader full />;

  return (
    <div>
      <PageHeader title="Orders Management" subtitle={`${orders.length} order(s)`} />
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
      <div className="mb-4 flex items-end gap-3 max-w-xs">
        <div className="flex-1">
          <label className="label">Filter by status</label>
          <select
            className="input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All</option>
            {ORDER_STATUS_LIST.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      {!orders.length ? (
        <EmptyState title="No orders yet" icon="📦" />
      ) : !filtered.length ? (
        <EmptyState
          title="No matching orders"
          message={`No orders with status "${statusFilter}".`}
          icon="🔍"
        />
      ) : (
        <OrdersTable orders={filtered} loading={action} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}
