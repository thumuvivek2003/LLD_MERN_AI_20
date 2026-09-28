import { useState } from 'react';
import { Layers, RefreshCw, Trash2 } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import systemApi from '../../../core/api/system.api.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card, CardHeader } from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import ConfirmDialog from '../../../core/components/ui/ConfirmDialog.jsx';
import { DonutChart } from '../../../core/components/charts/index.js';
import { ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import { formatBytes, formatDateTime, formatNumber, formatPercent } from '../../../core/utils/formatters.js';
import StatGrid from '../components/StatGrid.jsx';

/** System → Metadata Cache. Hit rate ring plus warm / invalidate actions. */
export function MetadataCachePage() {
  const toast = useToast();
  const cache = useAsync(() => systemApi.cache(), []);
  const [busy, setBusy] = useState(false);
  const [clearing, setClearing] = useState(false);

  const act = async (label, task) => {
    setBusy(true);
    try {
      await task();
      await cache.reload();
      toast.success(label);
    } catch (err) {
      toast.fromError(err, 'Cache action failed');
    } finally {
      setBusy(false);
      setClearing(false);
    }
  };

  const data = cache.data;

  return (
    <>
      <PageHeader
        title="Metadata Cache"
        subtitle="The singleton cache that keeps object and field definitions hot"
        icon={Layers}
        actions={
          <>
            <Button
              variant="secondary"
              icon={RefreshCw}
              loading={busy}
              onClick={() => act('Cache warmed', () => systemApi.refreshCache())}
            >
              Refresh Cache
            </Button>
            <Button variant="danger-outline" icon={Trash2} onClick={() => setClearing(true)}>
              Invalidate
            </Button>
          </>
        }
      />

      {cache.error ? (
        <Card>
          <ErrorState error={cache.error} onRetry={cache.reload} />
        </Card>
      ) : cache.loading && !data ? (
        <Card className="p-6">
          <SkeletonText lines={7} />
        </Card>
      ) : (
        <div className="grid gap-5 xl:grid-cols-3">
          <Card className="xl:col-span-1">
            <CardHeader title="Hit Rate" subtitle="Cache effectiveness" icon={Layers} />
            <div className="p-5">
              <DonutChart
                height={230}
                centerValue={formatPercent(data?.hitRate)}
                centerLabel="Hit Rate"
                data={[
                  { label: 'Hits', value: data?.hits ?? data?.hitRate ?? 0, color: '#10B981' },
                  { label: 'Misses', value: data?.misses ?? 0, color: '#E2E8F0' },
                ]}
              />
            </div>
          </Card>

          <Card className="xl:col-span-2">
            <CardHeader title="Cache Contents" subtitle="What is currently held in memory" icon={Layers} />
            <div className="p-5">
              <StatGrid
                columns={3}
                stats={[
                  { label: 'Cache Size', value: formatBytes(data?.sizeBytes) },
                  { label: 'Entries', value: formatNumber(data?.size) },
                  { label: 'Last Refresh', value: formatDateTime(data?.lastRefreshAt) },
                  { label: 'Cached Objects', value: formatNumber(data?.cachedObjects) },
                  { label: 'Cached Fields', value: formatNumber(data?.cachedFields) },
                  { label: 'Evictions', value: formatNumber(data?.evictions) },
                  { label: 'Hits', value: formatNumber(data?.hits) },
                  { label: 'Misses', value: formatNumber(data?.misses) },
                ]}
              />
            </div>
          </Card>
        </div>
      )}

      <ConfirmDialog
        open={clearing}
        onClose={() => setClearing(false)}
        title="Invalidate the metadata cache?"
        description="Every object and field definition will be re-read from MongoDB on next access."
        note="Expect a brief latency spike while the cache warms back up."
        confirmLabel="Invalidate cache"
        loading={busy}
        onConfirm={() => act('Cache invalidated', () => systemApi.invalidateCache())}
      />
    </>
  );
}

export default MetadataCachePage;
