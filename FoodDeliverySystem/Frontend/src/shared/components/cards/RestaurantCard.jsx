import { Link } from 'react-router-dom';
import { calculateDistanceLabel } from '../../../core/utils/distance.util.js';

export const RestaurantCard = ({ restaurant }) => (
  <Link to={`/customer/restaurants/${restaurant.id}`} className="card overflow-hidden block hover:shadow-md transition group">
    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
      <img
        src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'}
        alt={restaurant.name}
        className="w-full h-full object-cover group-hover:scale-105 transition"
      />
    </div>
    <div className="p-4">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">{restaurant.name}</h3>
        <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded">★ {restaurant.rating}</span>
      </div>
      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{restaurant.description || restaurant.address}</p>
      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span>📍 {restaurant.address}</span>
        {restaurant.distanceKm != null && <span className="font-medium">{calculateDistanceLabel(restaurant.distanceKm)}</span>}
      </div>
    </div>
  </Link>
);
