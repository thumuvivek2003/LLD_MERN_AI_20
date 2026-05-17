import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Loader from '../../../shared/components/Loader.jsx';
import Button from '../../../shared/components/Button.jsx';
import { useProductDetails } from '../hooks/useProducts.js';
import { useCart } from '../../cart/hooks/useCart.js';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProductDetails(id);
  const { addItem, actionLoading, actionError } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (loading) return <Loader full />;
  if (error || !product) {
    return (
      <div className="card">
        <p className="text-red-500">{error || 'Product not found'}</p>
        <Link to="/" className="text-brand font-semibold mt-2 inline-block">
          Back to products
        </Link>
      </div>
    );
  }

  async function handleAdd() {
    try {
      await addItem(product._id, quantity);
    } catch {}
  }

  async function handleBuyNow() {
    try {
      await addItem(product._id, quantity);
      navigate('/cart');
    } catch {}
  }

  return (
    <div>
      <Link to="/" className="text-sm text-slate-500 hover:text-brand mb-4 inline-block">
        ← Back to products
      </Link>
      <div className="card grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square overflow-hidden rounded-xl bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/600x600/EEF2FF/6366F1?text=${encodeURIComponent(product.name)}`;
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-brand font-bold">{product.category}</span>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">{product.name}</h1>
          <p className="text-3xl font-bold text-slate-900 mt-3">₹{product.price}</p>
          <p className="text-sm text-slate-500 mt-1">Inclusive of all taxes</p>
          <p className="text-slate-600 mt-4 leading-relaxed">{product.description}</p>

          <div className="mt-6">
            <p className="text-sm font-semibold text-slate-700 mb-2">Quantity</p>
            <div className="inline-flex items-center border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2 text-lg hover:bg-slate-50"
              >
                −
              </button>
              <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                className="px-4 py-2 text-lg hover:bg-slate-50"
              >
                +
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
          </div>

          {actionError && <p className="text-sm text-red-500 mt-3">{actionError}</p>}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={handleAdd} disabled={actionLoading || product.stock <= 0}>
              Add to Cart
            </Button>
            <Button variant="secondary" onClick={handleBuyNow} disabled={actionLoading || product.stock <= 0}>
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
