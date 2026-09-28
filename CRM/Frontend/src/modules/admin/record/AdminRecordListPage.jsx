import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Archive, ArchiveRestore, Eye, Layers, Search, Table2 } from 'lucide-react';
import useObject from '../../../core/hooks/useObject.js';
import useRecords from '../../../core/hooks/useRecords.js';
import usePagination from '../../../core/hooks/usePagination.js';
import useDebounce from '../../../core/hooks/useDebounce.js';
import usePermission from '../../../core/hooks/usePermission.js';
import recordsApi from '../../../core/api/records.api.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import { RECORD_STATUS, RECORD_STATUS_LABEL } from '../../../shared/enums/record-status.enum.js';
import { recordColumns } from '../../../shared/mapper/record.mapper.jsx';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import DataTable from '../../../core/components/table/DataTable.jsx';
import SearchInput from '../../../core/components/ui/SearchInput.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import Pagination from '../../../core/components/ui/Pagination.jsx';
import StatusPill from '../../../core/components/ui/StatusPill.jsx';
import { resolveIcon } from '../../../core/utils/icons.js';

/** Admin — records of one object, with row actions and a jump to bulk operations. */
export function AdminRecordListPage() {
  const { oid } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const permission = usePermission(oid);
  const { object, fields } = useObject(oid);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(RECORD_STATUS.ACTIVE);
  const [sort, setSort] = useState({ key: '', order: 'asc' });
  const [busy, setBusy] = useState(false);
  const pager = usePagination();
  const q = useDebounce(search, 350);

  const { records, meta, loading, error, reload } = useRecords(oid, {
    page: pager.page,
    limit: pager.limit,
    sort: sort.key,
    order: sort.order,
    status,
    q,
  });

  const visibleFields = useMemo(() => permission.visibleFields(fields), [fields, permission]);
  const columns = useMemo(
    () => recordColumns(visibleFields.slice(0, 6), { onSort: true }),
    [visibleFields],
  );

  const act = async (label, task) => {
    setBusy(true);
    try {
      await task();
      await reload();
      toast.success(label);
    } catch (err) {
      toast.fromError(err, 'Action failed');
    } finally {
      setBusy(false);
    }
  };

  const rowActions = (record) => [
    {
      id: 'view',
      label: 'View record',
      icon: Eye,
      onSelect: () => navigate(`/admin/records/${oid}/${record.recordId}`),
    },
    record.status === RECORD_STATUS.ACTIVE
      ? {
          id: 'archive',
          label: 'Archive record',
          icon: Archive,
          tone: 'danger',
          disabled: !permission.canDelete,
          onSelect: () =>
            act('Record archived', () => recordsApi.archive(oid, record.recordId)),
        }
      : {
          id: 'restore',
          label: 'Restore record',
          icon: ArchiveRestore,
          disabled: !permission.canUpdate,
          onSelect: () =>
            act('Record restored', () => recordsApi.restore(oid, record.recordId)),
        },
  ];

  const Icon = resolveIcon(object?.icon);

  return (
    <>
      <PageHeader
        title={object ? `Records: ${object.label}` : 'Records'}
        subtitle={`${(meta?.total ?? records.length).toLocaleString('en-IN')} records found`}
        icon={Icon}
        back="/admin/records"
        breadcrumbs={[
          { label: 'Records', to: '/admin/records' },
          { label: object?.label ?? oid },
        ]}
        meta={object ? <StatusPill kind="object" status={object.status} /> : null}
        actions={
          <>
            <Button as={Link} to={`/admin/search?objectId=${oid}`} variant="secondary" icon={Search}>
              Search & Filter
            </Button>
            <Button as={Link} to={`/admin/records/${oid}/bulk`} icon={Layers}>
              Bulk Operations
            </Button>
          </>
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
            placeholder="Search by name, email, phone…"
          />
          <Select
            className="w-40"
            value={status}
            placeholder="All records"
            onChange={(event) => {
              setStatus(event.target.value);
              pager.reset();
            }}
            options={Object.values(RECORD_STATUS).map((value) => ({
              value,
              label: RECORD_STATUS_LABEL[value],
            }))}
          />
        </div>

        <DataTable
          columns={columns}
          rows={records}
          rowKey={(record) => record.recordId}
          loading={loading || busy}
          error={error}
          onRetry={reload}
          sort={sort}
          onSortChange={setSort}
          rowActions={rowActions}
          onRowClick={(record) => navigate(`/admin/records/${oid}/${record.recordId}`)}
          emptyIcon={Table2}
          emptyTitle={q ? 'No records match your search' : 'No records yet'}
          emptyDescription={
            q ? 'Try a different search term.' : 'Records created by business users will appear here.'
          }
        />

        <Pagination
          page={pager.page}
          limit={pager.limit}
          total={meta?.total ?? records.length}
          totalPages={meta?.totalPages}
          onPageChange={pager.setPage}
          onLimitChange={pager.setLimit}
        />
      </Card>
    </>
  );
}

export default AdminRecordListPage;
