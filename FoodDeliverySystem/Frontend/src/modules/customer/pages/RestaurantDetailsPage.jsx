import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantDetails, getRestaurantMenu } from '../services/customer.api.js';
import { useApi } from '../../../core/hooks/useApi.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { MenuItemCard } from '../../../shared/components/cards/MenuItemCard.jsx';
import { useCart } from '../hooks/useCart.js';

export const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const restaurant = useApi(getRestaurantDetails);
  const menu = useApi(getRestaurantMenu);
  const { safeAdd } = useCart();

  useEffect(() => {
    restaurant.execute(id);
    menu.execute(id, true);
    // eslint-disable-next-line
  }, [id]);

  if (restaurant.loading || !restaurant.data) return <Loader />;
  const r = restaurant.data;

  return (
    <div>
      <div className="card overflow-hidden mb-6">
        <div className="h-48 sm:h-64 bg-gray-100">
          <img src={r.imageUrl || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200'} alt={r.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{r.name}</h1>
              <p className="text-gray-500 text-sm">{r.description}</p>
              <p className="text-gray-600 text-sm mt-2">📍 {r.address}</p>
            </div>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-semibold">★ {r.rating}</span>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-3">Menu</h2>
      {menu.loading ? <Loader /> :
        <div className="grid md:grid-cols-2 gap-4">
          {(menu.data || []).map((item) => <MenuItemCard key={item.id} item={item} onAdd={safeAdd} />)}
        </div>
      }
    </div>
  );
};
