import { Link } from 'react-router-dom';
import { ArrowRight, Link2, Workflow } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import lookupsApi from '../../../core/api/lookups.api.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card, CardHeader } from '../../../core/components/ui/Card.jsx';
import { KpiGrid, KpiTile } from '../../../core/components/layout/KpiTile.jsx';
import { EmptyState, ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import Badge from '../../../core/components/ui/Badge.jsx';
import { resolveIcon } from '../../../core/utils/icons.js';
import { formatNumber, formatPercent, formatRelative } from '../../../core/utils/formatters.js';

/** Admin — Relationships. Lookup graph (`/lookups/graph`) + resolution stats. */
export function RelationshipsPage() {
  const graph = useAsync(() => lookupsApi.graph(), []);
  const stats = useAsync(() => lookupsApi.stats(), []);

  const nodes = graph.data?.nodes || [];
  const edges = graph.data?.edges || [];
  const nodeById = (objectId) => nodes.find((node) => node.objectId === objectId);

  return (
    <>
      <PageHeader
        title="Relationships"
        subtitle="Lookup relationships between objects and how well they resolve"
        icon={Workflow}
      />

      <KpiGrid columns={4} className="mb-6">
        <KpiTile
          label="Total Lookups"
          value={formatNumber(stats.data?.total)}
          icon={Link2}
          tone="indigo"
          loading={stats.loading}
        />
        <KpiTile
          label="Resolved"
          value={formatNumber(stats.data?.resolved)}
          icon={Link2}
          tone="emerald"
          loading={stats.loading}
        />
        <KpiTile
          label="Failed"
          value={formatNumber(stats.data?.failed)}
          icon={Link2}
          tone="rose"
          loading={stats.loading}
        />
        <KpiTile
          label="Resolution Rate"
          value={formatPercent(stats.data?.resolutionRate)}
          icon={Link2}
          tone="sky"
          loading={stats.loading}
        />
      </KpiGrid>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Relationship Map" subtitle="Every MANY_TO_ONE lookup edge" icon={Workflow} />
          <div className="p-5">
            {graph.error ? (
              <ErrorState error={graph.error} onRetry={graph.reload} compact />
            ) : graph.loading ? (
              <SkeletonText lines={8} />
            ) : !edges.length ? (
              <EmptyState
                icon={Link2}
                title="No relationships yet"
                description="Add a Lookup field to an object to relate it to another."
                compact
              />
            ) : (
              <ul className="space-y-2.5">
                {edges.map((edge, index) => {
                  const from = nodeById(edge.from);
                  const to = nodeById(edge.to);
                  const FromIcon = resolveIcon(from?.icon);
                  const ToIcon = resolveIcon(to?.icon);
                  return (
                    <li
                      key={`${edge.from}-${edge.fieldId}-${index}`}
                      className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 px-3.5 py-3"
                    >
                      <Link
                        to={`/admin/objects/${edge.from}`}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-800 hover:text-accent"
                      >
                        <FromIcon size={15} className="text-slate-400" />
                        {from?.label || edge.from}
                      </Link>
                      <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <ArrowRight size={13} />
                        {edge.label || edge.fieldId}
                      </span>
                      <Link
                        to={`/admin/objects/${edge.to}`}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-800 hover:text-accent"
                      >
                        <ToIcon size={15} className="text-slate-400" />
                        {to?.label || edge.to}
                      </Link>
                      <Badge tone="violet" className="ml-auto">
                        {edge.type || 'MANY_TO_ONE'}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Recent Resolution Failures" subtitle="Lookups that could not be resolved" icon={Link2} />
          <div className="p-5">
            {stats.error ? (
              <ErrorState error={stats.error} onRetry={stats.reload} compact />
            ) : stats.loading ? (
              <SkeletonText lines={5} />
            ) : !stats.data?.recentFailures?.length ? (
              <EmptyState title="No failures" description="Every lookup resolved successfully." compact />
            ) : (
              <ul className="space-y-2.5">
                {stats.data.recentFailures.map((failure, index) => (
                  <li key={index} className="rounded-lg bg-rose-50/60 px-3.5 py-2.5">
                    <p className="text-xs font-semibold text-slate-800">
                      {failure.fromObject} · {failure.field} → {failure.toObject}
                    </p>
                    <p className="mt-0.5 text-[11px] text-rose-600">{failure.reason}</p>
                    <p className="mt-0.5 text-[10px] text-slate-400">{formatRelative(failure.at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

export default RelationshipsPage;
