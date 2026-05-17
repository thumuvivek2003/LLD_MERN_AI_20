export default function PriceBreakdown({ pricing }) {
  const { subtotal = 0, discount = 0, deliveryFee = 0, platformFee = 0, total = 0 } = pricing || {};
  return (
    <div className="space-y-2 text-sm">
      <Row label="Subtotal" value={`₹${subtotal}`} />
      {discount > 0 && <Row label="Discount" value={`− ₹${discount}`} valueClass="text-green-600" />}
      <Row label="Delivery Fee" value={deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`} valueClass={deliveryFee === 0 ? 'text-green-600' : ''} />
      <Row label="Platform Fee" value={`₹${platformFee}`} />
      <div className="border-t border-slate-100 pt-3 mt-2 flex items-center justify-between">
        <span className="text-base font-semibold text-slate-900">Total</span>
        <span className="text-xl font-bold text-slate-900">₹{total}</span>
      </div>
    </div>
  );
}

function Row({ label, value, valueClass = '' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={`font-medium ${valueClass || 'text-slate-800'}`}>{value}</span>
    </div>
  );
}
