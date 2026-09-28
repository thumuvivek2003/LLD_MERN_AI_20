import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Play, Star, Trash2 } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import { viewsApi } from '../../../core/api/search.api.js';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import { useToast } from '../../../core/context/ToastContext.jsx';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import DataTable from '../../../core/components/table/DataTable.jsx';
import Badge from '../../../core/components/ui/Badge.jsx';
import ConfirmDialog from '../../../core/components/ui/ConfirmDialog.jsx';
import { formatDate } from '../../../core/utils/formatters.js';

/** Business screen 12 — saved views (`GET /views`). */
export function SavedViewsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { objects } = useMetadata();
  const { data, loading, error, reload } = useAsync(() => viewsApi.list(), [], { initialData: [] });
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const views = Array.isArray(data) ? data : [];
  const objectLabel = (objectId) =>
    objects.find((object) => object.objectId === objectId)?.label ?? objectId;

  const open = (view) => navigate(`/business/objects/${view.objectId}/records`);

  const setDefault = async (view) => {
    setBusy(true);
    try {
      await viewsApi.update(view.viewId, { isDefault: !view.isDefault });
      await reload();
      toast.success(view.isDefault ? 'Default cleared' : 'Default view set');
    } catch (err) {
      toast.fromError(err, 'Could not update view');
    } finally {
      setBusy(false);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'View',
      className: 'font-semibold text-slate-800',
      render: (view) => (
        <span className="flex items-center gap-2">
          {view.name}
          {view.isDefault && <Badge tone="emerald">Default</Badge>}
        </span>
      ),
    },
    { key: 'objectId', header: 'Object', render: (view) => objectLabel(view.objectId) },
    {
      key: 'filters',
      header: 'Filters',
      render: (view) => `${view.filters?.length ?? 0} filter${view.filters?.length === 1 ? '' : 's'}`,
    },
    { key: 'logic', header: 'Match', render: (view) => (view.logic === 'OR' ? 'Any' : 'All') },
    {
      key: 'updatedAt',
      header: 'Updated',
      render: (view) => formatDate(view.updatedAt || view.createdAt),
    },
  ];

  const rowActions = (view) => [
    { id: 'open', label: 'Open view', icon: Play, onSelect: () => open(view) },
    {
      id: 'default',
      label: view.isDefault ? 'Clear default' : 'Make default',
      icon: Star,
      onSelect: () => setDefault(view),
    },
    { id: 'delete', label: 'Delete view', icon: Trash2, tone: 'danger', onSelect: () => setDeleting(view) },
  ];

  return (
    <>
      <PageHeader
        title="My Saved Views"
        subtitle="Quick access to your saved queries"
        icon={Bookmark}
      />

      <Card>
        <DataTable
          columns={columns}
          rows={views}
          rowKey={(view) => view.viewId}
          loading={loading || busy}
          error={error}
          onRetry={reload}
          rowActions={rowActions}
          onRowClick={open}
          emptyIcon={Bookmark}
          emptyTitle="No saved views yet"
          emptyDescription="Build a filter on Search & Filter, then press Save View."
        />
      </Card>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title={`Delete view "${deleting?.name ?? ''}"?`}
        description="The filters stored with this view are removed."
        confirmLabel="Delete view"
        loading={busy}
        onConfirm={async () => {
          const target = deleting;
          setDeleting(null);
          setBusy(true);
          try {
            await viewsApi.remove(target.viewId);
            await reload();
            toast.success('View deleted');
          } catch (err) {
            toast.fromError(err, 'Could not delete view');
          } finally {
            setBusy(false);
          }
        }}
      />
    </>
  );
}

export default SavedViewsPage;
