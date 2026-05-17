import { Link } from 'react-router-dom';
import PageHeader from '../../../shared/components/PageHeader.jsx';
import Loader from '../../../shared/components/Loader.jsx';
import EmptyState from '../../../shared/components/EmptyState.jsx';
import Button from '../../../shared/components/Button.jsx';
import CartList from '../components/CartList.jsx';
import CartSummary from '../components/CartSummary.jsx';
import { useCart } from '../hooks/useCart.js';

export default function CartPage() {
  const { cart, loading, actionError } = useCart();

  if (loading && !cart) return <Loader full />;

  const items = cart?.items || [];

  return (
    <div>
      <PageHeader title="My Cart" subtitle={`${items.length} item${items.length === 1 ? '' : 's'} in your cart`} />

      {actionError && (
        <p className="text-sm text-red-500 mb-3">{actionError}</p>
      )}

      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          message="Browse products and add items to your cart."
          icon="🛒"
          action={
            <Link to="/">
              <Button>Browse Products</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <CartList items={items} />
          <CartSummary cart={cart} />
        </div>
      )}
    </div>
  );
}
