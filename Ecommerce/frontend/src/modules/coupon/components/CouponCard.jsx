import Button from '../../../shared/components/Button.jsx';

const TYPE_LABEL = {
  percentage: (v) => `${v}% OFF`,
  flat: (v) => `₹${v} OFF`,
  free_shipping: () => 'FREE SHIPPING',
};

export default function CouponCard({ coupon, applied, onApply, onRemove, loading }) {
  const label = TYPE_LABEL[coupon.type] ? TYPE_LABEL[coupon.type](coupon.value) : coupon.code;
  return (
    <div className="border border-dashed border-brand/40 rounded-2xl p-4 bg-brand-light/40 flex items-center justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-brand-dark">{coupon.code}</span>
          <span className="chip bg-brand text-white">{label}</span>
        </div>
        {coupon.description && (
          <p className="text-xs text-slate-600 mt-1">{coupon.description}</p>
        )}
        {coupon.minCartValue > 0 && (
          <p className="text-xs text-slate-500 mt-1">Min cart value ₹{coupon.minCartValue}</p>
        )}
      </div>
      {applied ? (
        <Button variant="secondary" size="sm" disabled={loading} onClick={onRemove}>
          Remove
        </Button>
      ) : (
        <Button size="sm" disabled={loading} onClick={() => onApply(coupon.code)}>
          Apply
        </Button>
      )}
    </div>
  );
}
