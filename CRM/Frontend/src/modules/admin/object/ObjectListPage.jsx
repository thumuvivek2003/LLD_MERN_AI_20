import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Archive,
  ArchiveRestore,
  Copy,
  LayoutGrid,
  ListTree,
  Pencil,
  Plus,
  Send,
  Table2,
  Trash2,
} from 'lucide-react';
import useObjects from '../../../core/hooks/useObjects.js';
import useDebounce from '../../../core/hooks/useDebounce.js';
import usePagination from '../../../core/hooks/usePagination.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import objectsApi from '../../../core/api/objects.api.js';
import { OBJECT_STATUS, OBJECT_STATUS_LABEL } from '../../../shared/enums/object-status.enum.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import DataTable from '../../../core/components/table/DataTable.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import SearchInput from '../../../core/components/ui/SearchInput.jsx';
import StatusPill from '../../../core/components/ui/StatusPill.jsx';
import Pagination from '../../../core/components/ui/Pagination.jsx';
import ConfirmDialog from '../../../core/components/ui/ConfirmDialog.jsx';
import { formatNumber } from '../../../core/utils/formatters.js';
import { objectColorClass, resolveIcon } from '../../../core/utils/icons.js';
import cx from '../../../core/utils/cx.js';
import CloneObjectDialog from '../components/CloneObjectDialog.jsx';

/** Admin screen 2 — Objects list with search, status filter, row actions and pagination. */
export function ObjectListPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { invalidate } = useMetadata();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState({ key: 'label', order: 'asc' });
  const [cloning, setCloning] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const pager = usePagination({ initialLimit: 10 });
  const q = useDebounce(search, 350);

  const { objects, meta, loading, error, reload } = useObjects({
    q,
    status,
    page: pager.page,
    limit: pager.limit,
    sort: sort.key,
    order: sort.order,
  });

  const runAction = async (label, task, objectId) => {
    setBusy(true);
    try {
      await task();
      await invalidate(objectId);
      await reload();
      toast.success(label);
    } catch (err) {
      toast.fromError(err, label.replace('ed', '') + ' failed');
    } finally {
      setBusy(false);
    }
  };

  const columns = [
    {
      key: 'label',
      header: 'Object Name',
      sortable: true,
      render: (object) => {
        const Icon = resolveIcon(object.icon);
        return (
          <Link to={`/admin/objects/${object.objectId}`} className="flex items-center gap-2.5">
            <span
              className={cx(
                'flex h-7 w-7 items-center justify-center rounded-md ring-1',
                objectColorClass(object.color),
              )}
            >
              <Icon size={14} />
            </span>
            <span className="font-semibold text-slate-800 hover:text-accent">{object.label}</span>
          </Link>
        );
      },
    },
    {
      key: 'apiName',
      header: 'API Name',
      render: (object) => <span className="font-mono text-xs text-slate-400">{object.apiName}</span>,
    },
    { key: 'recordCount', header: 'Records', render: (object) => formatNumber(object.recordCount) },
    { key: 'fieldCount', header: 'Fields', render: (object) => object.fieldCount ?? 0 },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (object) => <StatusPill kind="object" status={object.status} />,
    },
  ];

  const rowActions = (object) => [
    { id: 'edit', label: 'Edit object', icon: Pencil, onSelect: () => navigate(`/admin/objects/${object.objectId}`) },
    { id: 'fields', label: 'Manage fields', icon: ListTree, onSelect: () => navigate(`/admin/objects/${object.objectId}/fields`) },
    { id: 'records', label: 'Browse records', icon: Table2, onSelect: () => navigate(`/admin/records/${object.objectId}`) },
    object.status === OBJECT_STATUS.DRAFT && {
      id: 'publish',
      label: 'Publish',
      icon: Send,
      onSelect: () => runAction('Object published', () => objectsApi.publish(object.objectId), object.objectId),
    },
    object.status === OBJECT_STATUS.PUBLISHED && {
      id: 'archive',
      label: 'Archive',
      icon: Archive,
      onSelect: () => runAction('Object archived', () => objectsApi.archive(object.objectId), object.objectId),
    },
    object.status === OBJECT_STATUS.ARCHIVED && {
      id: 'restore',
      label: 'Restore',
      icon: ArchiveRestore,
      onSelect: () => runAction('Object restored', () => objectsApi.restore(object.objectId), object.objectId),
    },
    { id: 'clone', label: 'Clone object', icon: Copy, onSelect: () => setCloning(object) },
    { id: 'delete', label: 'Delete object', icon: Trash2, tone: 'danger', onSelect: () => setDeleting(object) },
  ];

  return (
    <>
      <PageHeader
        title="Objects"
        subtitle="Manage all custom objects in the platform"
        icon={LayoutGrid}
        actions={
          <Button as={Link} to="/admin/objects/new" icon={Plus}>
            New Object
          </Button>
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
          <SearchInput
            className="min-w-[220px] flex-1"
            value={search}
            onChange={(value) => {
              setSearch(value);
              pager.reset();
            }}
            placeholder="Search objects…"
          />
          <Select
            className="w-44"
            value={status}
            placeholder="All statuses"
            onChange={(event) => {
              setStatus(event.target.value);
              pager.reset();
            }}
            options={Object.values(OBJECT_STATUS).map((value) => ({
              value,
              label: OBJECT_STATUS_LABEL[value],
            }))}
          />
        </div>

        <DataTable
          columns={columns}
          rows={objects}
          rowKey={(object) => object.objectId}
          loading={loading || busy}
          error={error}
          onRetry={reload}
          sort={sort}
          onSortChange={setSort}
          rowActions={rowActions}
          emptyIcon={LayoutGrid}
          emptyTitle={q || status ? 'No objects match your filters' : 'No objects yet'}
          emptyDescription={
            q || status
              ? 'Try a different search term or clear the status filter.'
              : 'Create your first custom object to start modelling data.'
          }
          emptyAction={
            !q && !status ? (
              <Button as={Link} to="/admin/objects/new" icon={Plus} size="sm">
                New Object
              </Button>
            ) : null
          }
        />

        <Pagination
          page={pager.page}
          limit={pager.limit}
          total={meta?.total ?? objects.length}
          totalPages={meta?.totalPages}
          onPageChange={pager.setPage}
          onLimitChange={pager.setLimit}
          limitOptions={[6, 10, 25, 50]}
        />
      </Card>

      <CloneObjectDialog
        object={cloning}
        onClose={() => setCloning(null)}
        onCloned={async (created) => {
          setCloning(null);
          await invalidate();
          await reload();
          toast.success('Object cloned', `${created?.label ?? 'Copy'} created as a draft`);
        }}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title={`Delete ${deleting?.label ?? 'object'}?`}
        description="This permanently removes the object definition."
        note="Deletion is blocked if the object still has records or is referenced by a lookup field."
        confirmLabel="Delete object"
        loading={busy}
        onConfirm={async () => {
          const target = deleting;
          setDeleting(null);
          await runAction('Object deleted', () => objectsApi.remove(target.objectId), target.objectId);
        }}
      />
    </>
  );
}

export default ObjectListPage;
