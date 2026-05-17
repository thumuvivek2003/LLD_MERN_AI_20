import PriceBreakdown from './PriceBreakdown.jsx';
import Button from '../../../shared/components/Button.jsx';

export default function CheckoutSummary({ cart, onPlaceOrder, loading, error, canPlace }) {
  return (
    <div className="card sticky top-20">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Price Details</h3>
      <div className="mb-4">
        <p className="text-sm text-slate-500">{cart?.items?.length || 0} items</p>
        {cart?.appliedCoupon && (
          <p className="text-xs text-green-600 mt-1">Coupon: {cart.appliedCoupon.code} applied</p>
        )}
      </div>
      <PriceBreakdown pricing={cart?.pricing} />
      {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
      <Button onClick={onPlaceOrder} disabled={loading || !canPlace} className="w-full mt-5">
        {loading ? 'Placing Order...' : `Place Order · ₹${cart?.pricing?.total || 0}`}
      </Button>
      <p className="text-xs text-slate-400 mt-3 text-center">
        By placing your order, you agree to our terms.
      </p>
    </div>
  );
}
