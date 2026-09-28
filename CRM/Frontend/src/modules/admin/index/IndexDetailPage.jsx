import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Activity, Clock, Database, History, RefreshCw, Trash2 } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import indexesApi from '../../../core/api/indexes.api.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import { INDEX_TYPE_LABEL } from '../../../shared/enums/index-type.enum.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import { Tabs } from '../../../core/components/ui/Tabs.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import StatusPill from '../../../core/components/ui/StatusPill.jsx';
import ConfirmDialog from '../../../core/components/ui/ConfirmDialog.jsx';
import DataTable from '../../../core/components/table/DataTable.jsx';
import ProgressBar from '../../../core/components/charts/ProgressBar.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import { ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import {
  formatBytes,
  formatDateTime,
  formatNumber,
  formatPercent,
  formatRelative,
} from '../../../core/utils/formatters.js';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Database },
  { id: 'performance', label: 'Performance', icon: Activity },
  { id: 'history', label: 'History', icon: History },
];

const Stat = ({ label, value, hint }) => (
  <div className="rounded-xl border border-slate-200 px-4 py-3">
    <p className="text-[11px] font-medium text-slate-500">{label}</p>
    <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
    {hint && <p className="mt-0.5 text-[11px] text-slate-400">{hint}</p>}
  </div>
);

/** Admin screen 13 — Index details with Overview · Performance · History. */
export function IndexDetailPage() {
  const { indexId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'overview';
  const [deleting, setDeleting] = useState(false);
  const [busy, setBusy] = useState(false);

  const { data: index, loading, error, reload } = useAsync(() => indexesApi.get(indexId), [indexId]);

  const rebuild = async () => {
    setBusy(true);
    try {
      await indexesApi.rebuild(indexId);
      await reload();
      toast.success('Rebuild queued', 'Watch progress under Background Jobs');
    } catch (err) {
      toast.fromError(err, 'Rebuild failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading && !index) {
    return (
      <Card className="p-6">
        <SkeletonText lines={7} />
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <ErrorState error={error} onRetry={reload} />
      </Card>
    );
  }
  if (!index) return null;

  const health = index.health ?? (index.status === 'ACTIVE' ? 100 : 0);
  const performance = index.performance || {};
  const hitRate =
    performance.hits + performance.misses
      ? (performance.hits / (performance.hits + performance.misses)) * 100
      : null;

  return (
    <>
      <PageHeader
        title={`Index Details: ${index.name || index.fieldLabel}`}
        subtitle={`${index.objectLabel || index.objectId} · ${index.fieldLabel || index.fieldId}`}
        icon={Database}
        back="/admin/indexes"
        breadcrumbs={[{ label: 'Indexes', to: '/admin/indexes' }, { label: index.name || indexId }]}
        meta={<StatusPill kind="index" status={index.status} />}
        actions={
          <>
            <Button variant="accent-outline" icon={RefreshCw} loading={busy} onClick={rebuild}>
              Rebuild Index
            </Button>
            <Button variant="danger-outline" icon={Trash2} onClick={() => setDeleting(true)}>
              Delete Index
            </Button>
          </>
        }
      />

      <Card>
        <div className="px-5 pt-4">
          <Tabs tabs={TABS} active={tab} onChange={(next) => setParams({ tab: next })} />
        </div>

        <div className="p-5">
          {tab === 'overview' && (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Stat label="Index Type" value={INDEX_TYPE_LABEL[index.type] || index.type} />
                <Stat label="Records Indexed" value={formatNumber(index.docCount)} />
                <Stat label="Index Size" value={formatBytes(index.sizeBytes)} />
                <Stat
                  label="Last Updated"
                  value={formatRelative(index.lastBuiltAt)}
                  hint={formatDateTime(index.lastBuiltAt)}
                />
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-end justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Health</p>
                    <p className="text-3xl font-bold text-slate-900">{formatPercent(health, 0)}</p>
                  </div>
                  <p className="text-xs text-slate-400">
                    Build took {index.buildMs ? `${index.buildMs} ms` : '—'}
                  </p>
                </div>
                <ProgressBar value={health} tone={health > 90 ? 'emerald' : health > 50 ? 'amber' : 'rose'} />
              </div>
            </div>
          )}

          {tab === 'performance' && (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Stat
                label="Avg Query Time"
                value={performance.avgQueryMs != null ? `${performance.avgQueryMs} ms` : '—'}
              />
              <Stat label="Cache Hits" value={formatNumber(performance.hits)} />
              <Stat label="Cache Misses" value={formatNumber(performance.misses)} />
              <Stat label="Hit Rate" value={hitRate == null ? '—' : formatPercent(hitRate)} />
            </div>
          )}

          {tab === 'history' && (
            <div className="-mx-5 -mb-5">
              <DataTable
                columns={[
                  {
                    key: 'at',
                    header: 'When',
                    className: 'font-semibold text-slate-800',
                    render: (entry) => formatDateTime(entry.at),
                  },
                  { key: 'action', header: 'Action' },
                  { key: 'docCount', header: 'Records', render: (entry) => formatNumber(entry.docCount) },
                  { key: 'ms', header: 'Duration', render: (entry) => (entry.ms != null ? `${entry.ms} ms` : '—') },
                ]}
                rows={index.history || []}
                rowKey={(entry, i) => `${entry.at}-${i}`}
                emptyIcon={Clock}
                emptyTitle="No build history yet"
                emptyDescription="Rebuilding this index records an entry here."
              />
            </div>
          )}
        </div>
      </Card>

      <ConfirmDialog
        open={deleting}
        onClose={() => setDeleting(false)}
        title={`Delete index "${index.name || index.fieldLabel}"?`}
        description="Searches on this field will fall back to a slower path."
        confirmLabel="Delete index"
        loading={busy}
        onConfirm={async () => {
          setBusy(true);
          try {
            await indexesApi.remove(indexId);
            toast.success('Index deleted');
            navigate('/admin/indexes');
          } catch (err) {
            toast.fromError(err, 'Could not delete index');
            setBusy(false);
            setDeleting(false);
          }
        }}
      />
    </>
  );
}

export default IndexDetailPage;
