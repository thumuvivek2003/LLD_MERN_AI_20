import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../../shared/components/PageHeader.jsx';
import Loader from '../../../shared/components/Loader.jsx';
import EmptyState from '../../../shared/components/EmptyState.jsx';
import Button from '../../../shared/components/Button.jsx';
import AddressSection from '../components/AddressSection.jsx';
import PaymentSelector from '../components/PaymentSelector.jsx';
import CheckoutSummary from '../components/CheckoutSummary.jsx';
import { useCart } from '../../cart/hooks/useCart.js';
import { useCheckout } from '../hooks/useCheckout.js';
import { usePayment } from '../../payment/hooks/usePayment.js';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, loading: cartLoading } = useCart();
  const { type, details, setDetails, changeType, processPayment } = usePayment();
  const { loading, error, placeOrder } = useCheckout();

  const [address, setAddress] = useState({ line1: '', city: '', pincode: '' });

  if (cartLoading && !cart) return <Loader full />;

  if (!cart?.items?.length) {
    return (
      <div>
        <PageHeader title="Checkout" />
        <EmptyState
          title="Your cart is empty"
          message="Add items to your cart before checkout."
          icon="🛒"
          action={
            <Link to="/">
              <Button>Browse Products</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const canPlace = address.line1 && address.city && address.pincode;

  async function handlePlaceOrder() {
    try {
      const payment = processPayment();
      const result = await placeOrder({ ...payment, address });
      const orderId = result?.order?._id;
      if (orderId) navigate(`/orders/success/${orderId}`);
    } catch {}
  }

  return (
    <div>
      <PageHeader title="Checkout" subtitle="Review your order and complete payment" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          <AddressSection address={address} onChange={setAddress} />
          <PaymentSelector
            type={type}
            onTypeChange={changeType}
            details={details}
            onDetailsChange={setDetails}
          />
        </div>
        <CheckoutSummary
          cart={cart}
          onPlaceOrder={handlePlaceOrder}
          loading={loading}
          error={error}
          canPlace={canPlace}
        />
      </div>
    </div>
  );
}
