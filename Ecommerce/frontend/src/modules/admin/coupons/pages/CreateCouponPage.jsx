import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageHeader from '../../../../shared/components/PageHeader.jsx';
import CouponForm from '../components/CouponForm.jsx';
import { createCoupon } from '../services/adminCoupon.service.js';

export default function CreateCouponPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(payload) {
    setLoading(true);
    setError('');
    try {
      await createCoupon(payload);
      navigate('/admin/coupons');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link to="/admin/coupons" className="text-sm text-slate-500 hover:text-brand mb-4 inline-block">
        ← Back to coupons
      </Link>
      <PageHeader title="Create Coupon" subtitle="Configure a new discount" />
      <CouponForm onSubmit={handleSubmit} loading={loading} error={error} />
    </div>
  );
}
