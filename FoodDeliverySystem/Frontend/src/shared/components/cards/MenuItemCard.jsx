import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../core/utils/currency.util.js';
import { Button } from '../ui/Button.jsx';

export const MenuItemCard = ({ item, onAdd }) => (
  <div className="card p-4 flex gap-4">
    <Link to={`/customer/menu-items/${item.id}`} className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100">
      <img src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'} alt={item.name} className="w-full h-full object-cover" />
    </Link>
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <Link to={`/customer/menu-items/${item.id}`} className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-3 h-3 border ${item.isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center`}>
              <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
            </span>
            <h3 className="font-semibold truncate">{item.name}</h3>
          </div>
          <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
          <div className="font-semibold mt-1">{formatCurrency(item.price)}</div>
        </Link>
        {onAdd && (
          <Button size="sm" onClick={() => onAdd(item)} disabled={!item.isAvailable}>
            {item.isAvailable ? 'Add' : 'N/A'}
          </Button>
        )}
      </div>
    </div>
  </div>
);
