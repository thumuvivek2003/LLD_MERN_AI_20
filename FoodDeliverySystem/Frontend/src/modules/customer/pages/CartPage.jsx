import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { formatCurrency } from '../../../core/utils/currency.util.js';

export const CartPage = () => {
  const { cart, loading, refresh, updateQuantity, removeFromCart, clearCart } = useCart();
  useEffect(() => { refresh(); }, [refresh]);

  if (loading) return <Loader />;
  if (!cart.items.length) {
    return <EmptyState
      icon="🛒" title="Your cart is empty"
      subtitle="Add items from a restaurant to begin"
      action={<Link to="/customer" className="btn-primary">Browse restaurants</Link>} />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="card divide-y">
        {cart.items.map((i) => (
          <div key={i.menuItemId} className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
              <img src={i.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'} alt={i.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{i.name}</div>
              <div className="text-sm text-gray-500">{formatCurrency(i.price)} × {i.quantity}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(i.menuItemId, i.quantity - 1)} className="w-8 h-8 rounded border hover:bg-gray-100">-</button>
              <span className="w-6 text-center">{i.quantity}</span>
              <button onClick={() => updateQuantity(i.menuItemId, i.quantity + 1)} className="w-8 h-8 rounded border hover:bg-gray-100">+</button>
            </div>
            <div className="font-semibold w-20 text-right">{formatCurrency(i.subtotal)}</div>
            <button onClick={() => removeFromCart(i.menuItemId)} className="text-red-500 hover:text-red-700">🗑️</button>
          </div>
        ))}
        <div className="p-4 bg-gray-50 flex justify-between items-center">
          <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-600">Clear cart</button>
          <div className="text-lg font-bold">Total: {formatCurrency(cart.total)}</div>
        </div>
      </div>
      <Link to="/customer/checkout" className="btn-primary w-full mt-4 block text-center">
        Proceed to checkout
      </Link>
    </div>
  );
};
