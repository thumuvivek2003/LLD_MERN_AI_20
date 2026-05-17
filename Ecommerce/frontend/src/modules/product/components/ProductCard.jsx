import { Link } from 'react-router-dom';
import Button from '../../../shared/components/Button.jsx';
import { useCart } from '../../cart/hooks/useCart.js';

export default function ProductCard({ product }) {
  const { addItem, actionLoading } = useCart();

  async function handleAdd(e) {
    e.preventDefault();
    try {
      await addItem(product._id, 1);
    } catch {}
  }

  return (
    <Link to={`/products/${product._id}`} className="group">
      <div className="card hover:shadow-md transition flex flex-col h-full">
        <div className="aspect-square w-full overflow-hidden rounded-xl bg-slate-100 mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/400x400/EEF2FF/6366F1?text=${encodeURIComponent(product.name)}`;
            }}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <span className="text-xs uppercase tracking-wide text-brand font-semibold">{product.category}</span>
          <h3 className="font-semibold text-slate-800 line-clamp-2 mt-1">{product.name}</h3>
          <p className="text-xl font-bold text-slate-900 mt-2">₹{product.price}</p>
          <div className="mt-3">
            <Button size="sm" onClick={handleAdd} disabled={actionLoading} className="w-full">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
