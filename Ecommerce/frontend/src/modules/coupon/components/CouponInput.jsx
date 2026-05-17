import { useState } from 'react';
import Button from '../../../shared/components/Button.jsx';
import Modal from '../../../shared/components/Modal.jsx';
import CouponList from './CouponList.jsx';
import { useCart } from '../../cart/hooks/useCart.js';

export default function CouponInput({ appliedCoupon }) {
  const { applyCoupon, removeCoupon, actionLoading, actionError } = useCart();
  const [code, setCode] = useState('');
  const [showList, setShowList] = useState(false);

  async function handleApply(e) {
    e.preventDefault();
    if (!code.trim()) return;
    try {
      await applyCoupon(code.trim().toUpperCase());
      setCode('');
    } catch {}
  }

  if (appliedCoupon) {
    return (
      <div className="border border-green-200 bg-green-50 rounded-xl p-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-green-700">Coupon Applied: {appliedCoupon.code}</p>
          <p className="text-xs text-green-600">You're saving on this order.</p>
        </div>
        <button
          onClick={() => removeCoupon().catch(() => {})}
          className="text-sm text-red-600 hover:text-red-700 font-semibold"
          disabled={actionLoading}
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleApply} className="flex gap-2">
        <input
          className="input flex-1"
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button type="submit" disabled={actionLoading || !code.trim()}>
          Apply
        </Button>
      </form>
      <button
        type="button"
        onClick={() => setShowList(true)}
        className="text-sm text-brand font-semibold hover:underline mt-2"
      >
        View available coupons
      </button>
      {actionError && <p className="text-xs text-red-500 mt-2">{actionError}</p>}
      <Modal open={showList} onClose={() => setShowList(false)} title="Available Coupons">
        <CouponList />
      </Modal>
    </div>
  );
}
