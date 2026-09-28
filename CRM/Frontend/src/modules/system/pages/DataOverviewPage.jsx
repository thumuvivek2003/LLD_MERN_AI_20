import { Database, HardDrive, LayoutGrid, ListTree, Table2 } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import systemApi from '../../../core/api/system.api.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card, CardHeader } from '../../../core/components/ui/Card.jsx';
import { KpiGrid, KpiTile } from '../../../core/components/layout/KpiTile.jsx';
import DataTable from '../../../core/components/table/DataTable.jsx';
import StatusPill from '../../../core/components/ui/StatusPill.jsx';
import { ProgressBar } from '../../../core/components/charts/index.js';
import { formatBytes, formatCompact, formatNumber } from '../../../core/utils/formatters.js';

/** System → Data Overview. Platform counts plus per-collection storage. */
export function DataOverviewPage() {
  const overview = useAsync(() => systemApi.overview(), []);
  const storage = useAsync(() => systemApi.storage(), []);

  const database = storage.data?.database;
  const collections = storage.data?.collections || [];

  const columns = [
    { key: 'name', header: 'Collection', className: 'font-semibold text-slate-800' },
    { key: 'docs', header: 'Documents', render: (row) => formatNumber(row.docs) },
    { key: 'sizeBytes', header: 'Size', render: (row) => formatBytes(row.sizeBytes) },
    {
      key: 'share',
      header: 'Share of DB',
      render: (row) => (
        <div className="w-40">
          <ProgressBar
            size="sm"
            tone="indigo"
            value={database?.usedBytes ? (row.sizeBytes / database.usedBytes) * 100 : 0}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Data Overview"
        subtitle="What the platform is storing and where it lives"
        icon={HardDrive}
      />

      <KpiGrid columns={4} className="mb-5">
        <KpiTile label="Objects" value={formatNumber(overview.data?.objects)} icon={LayoutGrid} tone="indigo" loading={overview.loading} />
        <KpiTile label="Fields" value={formatNumber(overview.data?.fields)} icon={ListTree} tone="sky" loading={overview.loading} />
        <KpiTile label="Records" value={formatCompact(overview.data?.records)} icon={Table2} tone="emerald" loading={overview.loading} />
        <KpiTile label="Indexes" value={formatNumber(overview.data?.indexes)} icon={Database} tone="amber" loading={overview.loading} />
      </KpiGrid>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card>
          <CardHeader title="Database" subtitle="MongoDB storage utilisation" icon={HardDrive} />
          <div className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">{database?.name || 'metaforce'}</span>
              <StatusPill kind="health" status={database?.status} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatBytes(database?.usedBytes)}</p>
            <p className="mt-0.5 text-xs text-slate-500">of {formatBytes(database?.totalBytes)}</p>
            <ProgressBar
              className="mt-3"
              value={database?.percent ?? 0}
              tone={(database?.percent ?? 0) > 80 ? 'rose' : 'emerald'}
            />
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader title="Collections" subtitle="Document counts and on-disk size" icon={Database} />
          <DataTable
            columns={columns}
            rows={collections}
            rowKey={(row) => row.name}
            loading={storage.loading}
            error={storage.error}
            onRetry={storage.reload}
            dense
            emptyIcon={Database}
            emptyTitle="No collections reported"
          />
        </Card>
      </div>
    </>
  );
}

export default DataOverviewPage;
