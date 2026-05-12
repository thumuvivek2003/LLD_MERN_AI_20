import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMenuItem } from '../services/customer.api.js';
import { useApi } from '../../../core/hooks/useApi.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { formatCurrency } from '../../../core/utils/currency.util.js';
import { useCart } from '../hooks/useCart.js';

export const MenuItemDetailsPage = () => {
  const { id } = useParams();
  const { data: item, loading, execute } = useApi(getMenuItem);
  const { safeAdd } = useCart();

  useEffect(() => { execute(id); }, [execute, id]);
  if (loading || !item) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card overflow-hidden">
        <div className="h-64 bg-gray-100">
          <img src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200'} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-block w-3 h-3 border ${item.isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center`}>
              <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
            </span>
            <span className="text-xs text-gray-500 uppercase">{item.category}</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">{item.name}</h1>
          <p className="text-gray-600">{item.description}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="text-2xl font-bold">{formatCurrency(item.price)}</div>
            <Button onClick={() => safeAdd(item)} disabled={!item.isAvailable}>
              {item.isAvailable ? 'Add to cart' : 'Not available'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
