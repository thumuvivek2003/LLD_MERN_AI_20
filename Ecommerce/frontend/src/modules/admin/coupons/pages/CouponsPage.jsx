import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../../../shared/components/PageHeader.jsx';
import Loader from '../../../../shared/components/Loader.jsx';
import EmptyState from '../../../../shared/components/EmptyState.jsx';
import Button from '../../../../shared/components/Button.jsx';
import CouponTable from '../components/CouponTable.jsx';
import { getAdminCoupons, toggleCoupon, deleteCoupon } from '../services/adminCoupon.service.js';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [action, setAction] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminCoupons();
      setCoupons(data.coupons || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function handleToggle(id) {
    setAction(true);
    try {
      await toggleCoupon(id);
      await fetchAll();
    } finally {
      setAction(false);
    }
  }

  async function handleDelete(coupon) {
    const ok = window.confirm(`Delete coupon "${coupon.code}"? This cannot be undone.`);
    if (!ok) return;
    setAction(true);
    setError('');
    try {
      await deleteCoupon(coupon._id);
      await fetchAll();
    } catch (e) {
      setError(e.message);
    } finally {
      setAction(false);
    }
  }

  if (loading) return <Loader full />;

  return (
    <div>
      <PageHeader
        title="Coupon Management"
        subtitle={`${coupons.length} coupon(s)`}
        actions={
          <Link to="/admin/coupons/new">
            <Button>+ Create Coupon</Button>
          </Link>
        }
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!coupons.length ? (
        <EmptyState
          title="No coupons yet"
          message="Create your first coupon to boost sales."
          icon="🎟️"
          action={
            <Link to="/admin/coupons/new">
              <Button>Create Coupon</Button>
            </Link>
          }
        />
      ) : (
        <CouponTable
          coupons={coupons}
          loading={action}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
