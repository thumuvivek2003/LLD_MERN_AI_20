import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../../../shared/components/PageHeader.jsx';
import Loader from '../../../../shared/components/Loader.jsx';
import Button from '../../../../shared/components/Button.jsx';
import EmptyState from '../../../../shared/components/EmptyState.jsx';
import {
  getCouponById,
  assignCoupon,
  unassignCouponFromUser,
  toggleCoupon,
} from '../services/adminCoupon.service.js';
import { getUsers } from '../../users/services/adminUsers.service.js';

export default function CouponDetailsPage() {
  const { id } = useParams();
  const [coupon, setCoupon] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState(false);
  const [error, setError] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [detail, users] = await Promise.all([getCouponById(id), getUsers()]);
      setCoupon(detail.coupon);
      setAssignedUsers(detail.assignedUsers || []);
      setAllUsers(users.users || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const availableUsers = useMemo(() => {
    const assignedIds = new Set(assignedUsers.map((u) => u._id));
    return allUsers.filter((u) => u.role !== 'admin' && !assignedIds.has(u._id));
  }, [allUsers, assignedUsers]);

  useEffect(() => {
    if (!selectedUserId && availableUsers.length) {
      setSelectedUserId(availableUsers[0]._id);
    }
    if (selectedUserId && !availableUsers.some((u) => u._id === selectedUserId)) {
      setSelectedUserId(availableUsers[0]?._id || '');
    }
  }, [availableUsers, selectedUserId]);

  async function handleAssign() {
    if (!selectedUserId) return;
    setAction(true);
    setError('');
    try {
      await assignCoupon(id, selectedUserId);
      await fetchAll();
    } catch (e) {
      setError(e.message);
    } finally {
      setAction(false);
    }
  }

  async function handleUnassign(userId) {
    setAction(true);
    setError('');
    try {
      await unassignCouponFromUser(id, userId);
      await fetchAll();
    } catch (e) {
      setError(e.message);
    } finally {
      setAction(false);
    }
  }

  async function handleToggle() {
    setAction(true);
    setError('');
    try {
      await toggleCoupon(id);
      await fetchAll();
    } catch (e) {
      setError(e.message);
    } finally {
      setAction(false);
    }
  }

  if (loading) return <Loader full />;

  if (!coupon) {
    return (
      <div className="card">
        <p className="text-red-500">{error || 'Coupon not found'}</p>
        <Link to="/admin/coupons" className="text-brand font-semibold mt-2 inline-block">
          Back to coupons
        </Link>
      </div>
    );
  }

  const valueLabel =
    coupon.type === 'percentage'
      ? `${coupon.value}% off`
      : coupon.type === 'flat'
      ? `₹${coupon.value} off`
      : 'Free Shipping';

  return (
    <div>
      <Link to="/admin/coupons" className="text-sm text-slate-500 hover:text-brand mb-4 inline-block">
        ← Back to coupons
      </Link>
      <PageHeader
        title="Coupon Details"
        subtitle={coupon.description || 'Manage assignment for this coupon'}
        actions={
          <Link to={`/admin/coupons/${coupon._id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
        }
      />
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      <div className="card flex flex-wrap items-center gap-4 justify-between mb-6">
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide">Code</p>
          <p className="text-3xl font-mono font-bold text-brand-dark mt-1">{coupon.code}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="chip bg-indigo-100 text-indigo-700 capitalize">
            {coupon.type.replace('_', ' ')}
          </span>
          <span className="chip bg-violet-100 text-violet-700">{valueLabel}</span>
          <span className="chip bg-slate-100 text-slate-700">Min ₹{coupon.minCartValue || 0}</span>
          <span className={`chip ${coupon.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
            {coupon.active ? 'Active' : 'Inactive'}
          </span>
          <Button
            size="sm"
            variant={coupon.active ? 'danger' : 'secondary'}
            disabled={action}
            onClick={handleToggle}
          >
            {coupon.active ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-3">Assign New User</h3>
        <div className="card flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[240px]">
            <label className="label">Select User</label>
            <select
              className="input"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              disabled={!availableUsers.length || action}
            >
              {availableUsers.length === 0 ? (
                <option value="">No users available</option>
              ) : (
                availableUsers.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} — {u.email}
                  </option>
                ))
              )}
            </select>
          </div>
          <Button onClick={handleAssign} disabled={!selectedUserId || action}>
            Assign
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-3">
          Assigned Users ({assignedUsers.length})
        </h3>
        {assignedUsers.length === 0 ? (
          <EmptyState
            title="No users assigned"
            message="This coupon is currently global — available to everyone."
            icon="🎟️"
          />
        ) : (
          <div className="card overflow-x-auto p-0">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-600">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {assignedUsers.map((u, i) => (
                  <tr key={u._id} className={i % 2 ? 'bg-slate-50/40' : 'bg-white'}>
                    <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={action}
                        onClick={() => handleUnassign(u._id)}
                      >
                        Unassign
                      </Button>
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
