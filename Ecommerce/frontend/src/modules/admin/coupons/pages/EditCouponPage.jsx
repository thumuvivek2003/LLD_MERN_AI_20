import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PageHeader from '../../../../shared/components/PageHeader.jsx';
import Loader from '../../../../shared/components/Loader.jsx';
import CouponForm from '../components/CouponForm.jsx';
import { getCouponById, updateCoupon } from '../services/adminCoupon.service.js';

export default function EditCouponPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getCouponById(id);
        setCoupon(data.coupon);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSubmit(payload) {
    setSaving(true);
    setError('');
    try {
      await updateCoupon(id, payload);
      navigate('/admin/coupons');
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
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

  return (
    <div>
      <Link to="/admin/coupons" className="text-sm text-slate-500 hover:text-brand mb-4 inline-block">
        ← Back to coupons
      </Link>
      <PageHeader title="Edit Coupon" subtitle={`Code: ${coupon.code} (immutable)`} />
      <CouponForm
        onSubmit={handleSubmit}
        loading={saving}
        error={error}
        mode="edit"
        initial={coupon}
      />
    </div>
  );
}
