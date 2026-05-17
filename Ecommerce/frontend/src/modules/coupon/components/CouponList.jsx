import CouponCard from './CouponCard.jsx';
import Loader from '../../../shared/components/Loader.jsx';
import EmptyState from '../../../shared/components/EmptyState.jsx';
import { useCoupon } from '../hooks/useCoupon.js';
import { useCart } from '../../cart/hooks/useCart.js';

export default function CouponList() {
  const { coupons, loading, error, applyCoupon, removeCoupon, applying } = useCoupon();
  const { cart } = useCart();
  const appliedCode = cart?.appliedCoupon?.code;

  if (loading) return <Loader label="Loading coupons..." />;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!coupons.length)
    return <EmptyState title="No coupons available" message="Check back later for deals." icon="🎁" />;

  return (
    <div className="space-y-3">
      {coupons.map((c) => (
        <CouponCard
          key={c._id}
          coupon={c}
          applied={appliedCode === c.code}
          loading={applying}
          onApply={(code) => applyCoupon(code).catch(() => {})}
          onRemove={() => removeCoupon().catch(() => {})}
        />
      ))}
    </div>
  );
}
