import QuantityController from './QuantityController.jsx';
import { useCart } from '../hooks/useCart.js';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem, actionLoading } = useCart();

  return (
    <div className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0">
      <div className="h-20 w-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/200x200/EEF2FF/6366F1?text=${encodeURIComponent(item.name)}`;
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-800 truncate">{item.name}</h4>
        <p className="text-sm text-slate-500 mt-1">₹{item.price} each</p>
        <div className="mt-2">
          <QuantityController
            value={item.quantity}
            onChange={(q) => updateQuantity(item.productId, q)}
            disabled={actionLoading}
          />
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-slate-900">₹{item.subtotal}</p>
        <button
          onClick={() => removeItem(item.productId)}
          disabled={actionLoading}
          className="mt-2 text-sm text-red-500 hover:text-red-600 font-medium"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
