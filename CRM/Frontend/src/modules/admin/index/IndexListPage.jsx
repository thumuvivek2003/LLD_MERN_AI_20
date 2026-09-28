import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Activity, Database, Eye, Plus, RefreshCw, Trash2 } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import indexesApi from '../../../core/api/indexes.api.js';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import { useToast } from '../../../core/context/ToastContext.jsx';
import { INDEX_STATUS, INDEX_STATUS_LABEL, INDEX_TYPE_LABEL } from '../../../shared/enums/index-type.enum.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { KpiGrid, KpiTile } from '../../../core/components/layout/KpiTile.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import DataTable from '../../../core/components/table/DataTable.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import StatusPill from '../../../core/components/ui/StatusPill.jsx';
import ConfirmDialog from '../../../core/components/ui/ConfirmDialog.jsx';
import { formatBytes, formatCompact, formatRelative } from '../../../core/utils/formatters.js';
import BuildIndexDialog from './BuildIndexDialog.jsx';

/** Admin screen 12 — Index management (table + Build Index + status counters). */
export function IndexListPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { objects } = useMetadata();
  const [params, setParams] = useSearchParams();
  const objectId = params.get('objectId') || '';
  const status = params.get('status') || '';
  const [building, setBuilding] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const list = useAsync(
    () => indexesApi.list({ ...(objectId ? { objectId } : {}), ...(status ? { status } : {}) }),
    [objectId, status],
    { initialData: [] },
  );
  const summary = useAsync(() => indexesApi.summary(), []);

  const refreshAll = async () => {
    await Promise.all([list.reload(), summary.reload()]);
  };

  const act = async (label, task) => {
    setBusy(true);
    try {
      await task();
      await refreshAll();
      toast.success(label);
    } catch (err) {
      toast.fromError(err, 'Action failed');
    } finally {
      setBusy(false);
    }
  };

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  const columns = [
    {
      key: 'name',
      header: 'Index',
      className: 'font-semibold text-slate-800',
      render: (index) => index.name || index.fieldLabel,
    },
    { key: 'objectLabel', header: 'Object', render: (index) => index.objectLabel || index.objectId },
    { key: 'fieldLabel', header: 'Field', render: (index) => index.fieldLabel || index.fieldId },
    { key: 'type', header: 'Type', render: (index) => INDEX_TYPE_LABEL[index.type] || index.type },
    { key: 'status', header: 'Status', render: (index) => <StatusPill kind="index" status={index.status} /> },
    { key: 'docCount', header: 'Records', render: (index) => formatCompact(index.docCount) },
    { key: 'sizeBytes', header: 'Size', render: (index) => formatBytes(index.sizeBytes) },
    {
      key: 'lastBuiltAt',
      header: 'Last Updated',
      render: (index) => (
        <span className="text-xs text-slate-500">{formatRelative(index.lastBuiltAt)}</span>
      ),
    },
  ];

  const rowActions = (index) => [
    { id: 'view', label: 'View details', icon: Eye, onSelect: () => navigate(`/admin/indexes/${index.indexId}`) },
    {
      id: 'rebuild',
      label: 'Rebuild index',
      icon: RefreshCw,
      onSelect: () => act('Rebuild queued', () => indexesApi.rebuild(index.indexId)),
    },
    { id: 'delete', label: 'Delete index', icon: Trash2, tone: 'danger', onSelect: () => setDeleting(index) },
  ];

  return (
    <>
      <PageHeader
        title="Indexes"
        subtitle="Manage search indexes for better performance"
        icon={Database}
        actions={
          <>
            <Button
              variant="secondary"
              icon={RefreshCw}
              loading={busy}
              onClick={() => act('Rebuild-all queued', () => indexesApi.rebuildAll())}
            >
              Rebuild All
            </Button>
            <Button icon={Plus} onClick={() => setBuilding(true)}>
              Build Index
            </Button>
          </>
        }
      />

      <KpiGrid columns={5} className="mb-6">
        <KpiTile label="Total" value={summary.data?.total ?? 0} icon={Database} tone="indigo" loading={summary.loading} />
        <KpiTile label="Healthy" value={summary.data?.healthy ?? 0} icon={Activity} tone="emerald" loading={summary.loading} />
        <KpiTile label="Building" value={summary.data?.building ?? 0} icon={RefreshCw} tone="amber" loading={summary.loading} />
        <KpiTile label="Failed" value={summary.data?.failed ?? 0} icon={Database} tone="rose" loading={summary.loading} />
        <KpiTile label="Inactive" value={summary.data?.inactive ?? 0} icon={Database} tone="slate" loading={summary.loading} />
      </KpiGrid>

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
          <Select
            className="w-52"
            value={objectId}
            placeholder="All objects"
            onChange={(event) => setParam('objectId', event.target.value)}
            options={objects.map((object) => ({ value: object.objectId, label: object.label }))}
          />
          <Select
            className="w-44"
            value={status}
            placeholder="All statuses"
            onChange={(event) => setParam('status', event.target.value)}
            options={Object.values(INDEX_STATUS).map((value) => ({
              value,
              label: INDEX_STATUS_LABEL[value],
            }))}
          />
        </div>

        <DataTable
          columns={columns}
          rows={Array.isArray(list.data) ? list.data : []}
          rowKey={(index) => index.indexId}
          loading={list.loading || busy}
          error={list.error}
          onRetry={list.reload}
          rowActions={rowActions}
          onRowClick={(index) => navigate(`/admin/indexes/${index.indexId}`)}
          emptyIcon={Database}
          emptyTitle="No indexes yet"
          emptyDescription="Build an index on a searchable field to speed up queries."
          emptyAction={
            <Button size="sm" icon={Plus} onClick={() => setBuilding(true)}>
              Build Index
            </Button>
          }
        />
      </Card>

      <BuildIndexDialog
        open={building}
        defaultObjectId={objectId}
        onClose={() => setBuilding(false)}
        onBuilt={async () => {
          setBuilding(false);
          await refreshAll();
        }}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title={`Delete index "${deleting?.name ?? ''}"?`}
        description="Queries on this field fall back to a slower path until it is rebuilt."
        confirmLabel="Delete index"
        loading={busy}
        onConfirm={async () => {
          const target = deleting;
          setDeleting(null);
          await act('Index deleted', () => indexesApi.remove(target.indexId));
        }}
      />
    </>
  );
}

export default IndexListPage;
