const TRANSITIONS = {
  CREATED: ['CREATED', 'CANCELLED'],
  PAID: ['PAID', 'SHIPPED', 'CANCELLED'],
  SHIPPED: ['SHIPPED', 'DELIVERED'],
  DELIVERED: ['DELIVERED'],
  CANCELLED: ['CANCELLED'],
};

export default function OrderStatusDropdown({ order, loading, onChange }) {
  const options = TRANSITIONS[order.status] || [order.status];
  return (
    <select
      className="input py-1.5 text-sm"
      value={order.status}
      disabled={loading || options.length <= 1}
      onChange={(e) => onChange(order._id, e.target.value)}
    >
      {options.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
      {!options.includes(order.status) && <option value={order.status}>{order.status}</option>}
    </select>
  );
}
