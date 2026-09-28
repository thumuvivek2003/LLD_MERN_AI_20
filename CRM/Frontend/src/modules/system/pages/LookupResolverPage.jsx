import { ArrowRight, Link2, RefreshCw } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import lookupsApi from '../../../core/api/lookups.api.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card, CardHeader } from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { KpiGrid, KpiTile } from '../../../core/components/layout/KpiTile.jsx';
import DataTable from '../../../core/components/table/DataTable.jsx';
import Badge from '../../../core/components/ui/Badge.jsx';
import { formatCompact, formatDateTime, formatPercent } from '../../../core/utils/formatters.js';

/** System → Lookup Resolver. Resolution throughput and the failures behind it. */
export function LookupResolverPage() {
  const stats = useAsync(() => lookupsApi.stats(), []);
  const graph = useAsync(() => lookupsApi.graph(), []);

  const nodes = graph.data?.nodes || [];
  const edges = graph.data?.edges || [];
  const label = (objectId) => nodes.find((node) => node.objectId === objectId)?.label ?? objectId;

  const failureColumns = [
    { key: 'fromObject', header: 'From Object', className: 'font-semibold text-slate-800' },
    { key: 'field', header: 'Field' },
    { key: 'toObject', header: 'To Object' },
    {
      key: 'reason',
      header: 'Reason',
      render: (row) => <Badge tone="rose">{row.reason}</Badge>,
    },
    { key: 'at', header: 'Time', render: (row) => formatDateTime(row.at) },
  ];

  const edgeColumns = [
    {
      key: 'from',
      header: 'Relationship',
      className: 'font-semibold text-slate-800',
      render: (edge) => (
        <span className="flex items-center gap-2">
          {label(edge.from)}
          <ArrowRight size={12} className="text-slate-400" />
          {label(edge.to)}
        </span>
      ),
    },
    { key: 'label', header: 'Field', render: (edge) => edge.label || edge.fieldId },
    { key: 'type', header: 'Cardinality', render: (edge) => <Badge tone="violet">{edge.type}</Badge> },
  ];

  return (
    <>
      <PageHeader
        title="Lookup Resolver"
        subtitle="How reliably lookup references resolve to their target records"
        icon={Link2}
        actions={
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={() => {
              stats.reload();
              graph.reload();
            }}
          >
            Refresh
          </Button>
        }
      />

      <KpiGrid columns={4} className="mb-5">
        <KpiTile label="Total Lookups" value={formatCompact(stats.data?.total)} icon={Link2} tone="indigo" loading={stats.loading} />
        <KpiTile label="Resolved" value={formatCompact(stats.data?.resolved)} icon={Link2} tone="emerald" loading={stats.loading} />
        <KpiTile label="Failed" value={formatCompact(stats.data?.failed)} icon={Link2} tone="rose" loading={stats.loading} />
        <KpiTile label="Resolution Rate" value={formatPercent(stats.data?.resolutionRate)} icon={Link2} tone="sky" loading={stats.loading} />
      </KpiGrid>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader title="Recent Failures" subtitle="Lookups the resolver could not satisfy" icon={Link2} />
          <DataTable
            columns={failureColumns}
            rows={stats.data?.recentFailures || []}
            rowKey={(row, index) => index}
            loading={stats.loading}
            error={stats.error}
            onRetry={stats.reload}
            dense
            emptyIcon={Link2}
            emptyTitle="No resolution failures"
            emptyDescription="Every lookup resolved to a live record."
          />
        </Card>

        <Card>
          <CardHeader title="Relationship Graph" subtitle="Every lookup edge in the schema" icon={Link2} />
          <DataTable
            columns={edgeColumns}
            rows={edges}
            rowKey={(edge, index) => `${edge.from}-${edge.fieldId}-${index}`}
            loading={graph.loading}
            error={graph.error}
            onRetry={graph.reload}
            dense
            emptyIcon={Link2}
            emptyTitle="No relationships defined"
          />
        </Card>
      </div>
    </>
  );
}

export default LookupResolverPage;
