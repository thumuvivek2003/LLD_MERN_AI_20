import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button.jsx';
import PriceBreakdown from '../../checkout/components/PriceBreakdown.jsx';
import CouponInput from '../../coupon/components/CouponInput.jsx';

export default function CartSummary({ cart }) {
  const navigate = useNavigate();
  const pricing = cart?.pricing || { subtotal: 0, discount: 0, deliveryFee: 0, platformFee: 0, total: 0 };

  return (
    <div className="card sticky top-20">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h3>
      <CouponInput appliedCoupon={cart?.appliedCoupon} />
      <div className="border-t border-slate-100 pt-4 mt-4">
        <PriceBreakdown pricing={pricing} />
      </div>
      <Button
        className="w-full mt-5"
        disabled={!cart?.items?.length}
        onClick={() => navigate('/checkout')}
      >
        Proceed to Checkout
      </Button>
    </div>
  );
}
