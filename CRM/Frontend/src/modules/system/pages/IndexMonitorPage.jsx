import { useState } from 'react';
import { Database, RefreshCw } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import indexesApi from '../../../core/api/indexes.api.js';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import { useToast } from '../../../core/context/ToastContext.jsx';
import { INDEX_STATUS, INDEX_STATUS_LABEL } from '../../../shared/enums/index-type.enum.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { KpiGrid, KpiTile } from '../../../core/components/layout/KpiTile.jsx';
import IndexSummaryTable, { IndexStatusCounters } from '../components/IndexSummaryTable.jsx';

/** System → Index Management. Every index the engine maintains. */
export function IndexMonitorPage() {
  const toast = useToast();
  const { objects } = useMetadata();
  const [objectId, setObjectId] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const list = useAsync(
    () =>
      indexesApi.list({
        limit: 200,
        ...(objectId ? { objectId } : {}),
        ...(status ? { status } : {}),
      }),
    [objectId, status],
    { initialData: [] },
  );
  const summary = useAsync(() => indexesApi.summary(), []);

  const rebuildAll = async () => {
    setBusy(true);
    try {
      await indexesApi.rebuildAll();
      await Promise.all([list.reload(), summary.reload()]);
      toast.success('Rebuild queued for all indexes');
    } catch (err) {
      toast.fromError(err, 'Rebuild failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Index Management"
        subtitle="Monitor and manage all search indexes"
        icon={Database}
        actions={
          <Button variant="secondary" icon={RefreshCw} loading={busy} onClick={rebuildAll}>
            Rebuild All
          </Button>
        }
      />

      <KpiGrid columns={4} className="mb-5">
        <KpiTile label="Total Indexes" value={summary.data?.total ?? 0} icon={Database} tone="indigo" loading={summary.loading} />
        <KpiTile label="Healthy" value={summary.data?.healthy ?? 0} icon={Database} tone="emerald" loading={summary.loading} />
        <KpiTile label="Rebuilding" value={summary.data?.building ?? 0} icon={RefreshCw} tone="amber" loading={summary.loading} />
        <KpiTile label="Failed" value={summary.data?.failed ?? 0} icon={Database} tone="rose" loading={summary.loading} />
      </KpiGrid>

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
          <Select
            className="w-52"
            value={objectId}
            placeholder="All objects"
            onChange={(event) => setObjectId(event.target.value)}
            options={objects.map((object) => ({ value: object.objectId, label: object.label }))}
          />
          <Select
            className="w-44"
            value={status}
            placeholder="All statuses"
            onChange={(event) => setStatus(event.target.value)}
            options={Object.values(INDEX_STATUS).map((value) => ({
              value,
              label: INDEX_STATUS_LABEL[value],
            }))}
          />
        </div>

        <IndexSummaryTable
          indexes={Array.isArray(list.data) ? list.data : []}
          loading={list.loading}
          error={list.error}
          onRetry={list.reload}
          dense={false}
        />
        <IndexStatusCounters summary={summary.data} />
      </Card>
    </>
  );
}

export default IndexMonitorPage;
