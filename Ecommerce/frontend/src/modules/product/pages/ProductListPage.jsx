import { useMemo, useState } from 'react';
import PageHeader from '../../../shared/components/PageHeader.jsx';
import Loader from '../../../shared/components/Loader.jsx';
import EmptyState from '../../../shared/components/EmptyState.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import ProductFilters from '../components/ProductFilters.jsx';
import { useProducts } from '../hooks/useProducts.js';

export default function ProductListPage() {
  const { products, loading, error } = useProducts();
  const [category, setCategory] = useState(null);

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    if (!category) return products;
    return products.filter((p) => p.category === category);
  }, [products, category]);

  return (
    <div>
      <div className="bg-gradient-to-r from-brand to-accent rounded-2xl p-6 md:p-8 text-white mb-6">
        <p className="text-sm uppercase tracking-wider opacity-90">Top Deals</p>
        <h2 className="text-2xl md:text-3xl font-bold mt-1">Mega Sale — Up to 50% off</h2>
        <p className="text-sm opacity-90 mt-2 max-w-xl">
          Fresh arrivals across audio, fashion, and lifestyle. Apply coupons at checkout for extra savings.
        </p>
      </div>

      <PageHeader title="Shop Products" subtitle={`${filtered.length} items available`} />

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <ProductFilters categories={categories} selected={category} onSelect={setCategory} />
        <div>
          {loading && <Loader />}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {!loading && !error && filtered.length === 0 && (
            <EmptyState title="No products found" message="Try a different category." icon="🛍️" />
          )}
          {!loading && filtered.length > 0 && <ProductGrid products={filtered} />}
        </div>
      </div>
    </div>
  );
}
