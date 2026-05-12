import { useEffect, useState, useMemo } from 'react';
import { getRestaurants } from '../services/customer.api.js';
import { useApi } from '../../../core/hooks/useApi.js';
import { useDebounce } from '../../../core/hooks/useDebounce.js';
import { RestaurantCard } from '../../../shared/components/cards/RestaurantCard.jsx';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';

export const HomePage = () => {
  const { data: restaurants = [], loading, execute } = useApi(getRestaurants);
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 200);

  useEffect(() => { execute(); }, [execute]);

  const filtered = useMemo(() =>
    (restaurants || []).filter((r) =>
      r.name.toLowerCase().includes(debounced.toLowerCase()) ||
      (r.description || '').toLowerCase().includes(debounced.toLowerCase())
    ), [restaurants, debounced]);

  return (
    <div>
      <section className="bg-gradient-to-br from-brand to-brand-dark rounded-2xl p-6 md:p-10 text-white mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">What are you craving today?</h1>
        <p className="opacity-90">Order from your favourite restaurants nearby</p>
        <div className="mt-4 max-w-md">
          <Input placeholder="🔍 Search restaurants or cuisines" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </section>

      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-2xl font-bold">Restaurants near you</h2>
        <span className="text-sm text-gray-500">{filtered.length} options</span>
      </div>

      {loading ? <Loader /> :
        filtered.length === 0 ? <EmptyState icon="🍴" title="No restaurants found" subtitle="Try a different search" /> :
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
      }
    </div>
  );
};
