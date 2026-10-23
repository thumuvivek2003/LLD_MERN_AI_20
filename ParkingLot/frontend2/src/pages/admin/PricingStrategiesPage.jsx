import { useQuery } from '@tanstack/react-query';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Loader } from '../../components/ui/Loader.jsx';
import { pricingApi } from '../../features/pricing/api.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export function PricingStrategiesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['pricing-strategies'],
    queryFn: pricingApi.list,
  });

  return (
    <PageContainer
      title="Pricing Strategies"
      subtitle="Define how fares are calculated"
      actions={<Button>+ New Strategy</Button>}
    >
      <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
        Preview only — pricing strategies live server-side under
        <code> backend2/src/strategies/pricing</code> and are applied during
        <code> POST /api/exit</code>. No CRUD endpoint is exposed yet.
      </div>
      {isLoading ? (
        <Loader label="Loading strategies…" />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(data || []).map((p) => (
            <Card key={p.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-ink-900">{p.name}</h3>
                  <p className="text-sm text-ink-500">Per {p.unit}</p>
                </div>
                <Badge tone={p.active ? 'success' : 'neutral'}>
                  {p.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-3xl font-semibold text-ink-900">
                  {formatCurrency(p.baseRate)}
                </span>
                <span className="text-sm text-ink-500">/ {p.unit}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="secondary" fullWidth>Edit</Button>
                <Button size="sm" variant="ghost">{p.active ? 'Disable' : 'Enable'}</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
