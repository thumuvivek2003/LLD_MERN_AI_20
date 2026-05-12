import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { useOrders } from '../hooks/useOrders.js';
import { useAuthContext } from '../../../core/context/AuthContext.jsx';
import { Input, Textarea } from '../../../shared/components/ui/Input.jsx';
import { PaymentForm } from '../../../shared/components/forms/PaymentForm.jsx';
import { formatCurrency } from '../../../core/utils/currency.util.js';
import { showErrorToast, showSuccessToast } from '../../../core/services/notification.service.js';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';

export const CheckoutPage = () => {
  const { user } = useAuthContext();
  const { cart, refresh } = useCart();
  const { placeNewOrder } = useOrders();
  const [address, setAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { refresh(); }, [refresh]);

  const handlePay = async ({ paymentMethod }) => {
    if (!address.trim()) { showErrorToast('Please enter a delivery address'); return; }
    setLoading(true);
    try {
      const order = await placeNewOrder({ paymentMethod, deliveryAddress: address });
      showSuccessToast('Order placed!');
      navigate(`/customer/orders/${order.id}`);
    } catch (e) { showErrorToast(e.message); }
    finally { setLoading(false); }
  };

  if (!cart.items.length) {
    return <EmptyState icon="🛒" title="Nothing to checkout" subtitle="Your cart is empty" />;
  }

  return (
    <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Delivery details</h1>
        <Input label="Phone" value={user?.phoneNumber || ''} disabled />
        <Textarea label="Delivery Address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House, Street, City..." />

        <h2 className="text-xl font-bold mt-6 mb-2">Payment</h2>
        <PaymentForm onSubmit={handlePay} loading={loading} />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Order summary</h2>
        <div className="card p-4 space-y-2">
          {cart.items.map((i) => (
            <div key={i.menuItemId} className="flex justify-between text-sm">
              <span>{i.name} × {i.quantity}</span>
              <span>{formatCurrency(i.subtotal)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2 flex justify-between font-bold">
            <span>Total</span>
            <span>{formatCurrency(cart.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
