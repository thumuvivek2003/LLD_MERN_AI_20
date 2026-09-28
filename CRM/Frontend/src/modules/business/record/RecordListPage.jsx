import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Archive, Eye, Pencil, Table2 } from 'lucide-react';
import useObject from '../../../core/hooks/useObject.js';
import useRecords from '../../../core/hooks/useRecords.js';
import useSearch from '../../../core/hooks/useSearch.js';
import usePagination from '../../../core/hooks/usePagination.js';
import usePermission from '../../../core/hooks/usePermission.js';
import useAsync from '../../../core/hooks/useAsync.js';
import { viewsApi } from '../../../core/api/search.api.js';
import recordsApi from '../../../core/api/records.api.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import SearchQueryBuilder from '../../../core/utils/queryBuilder.js';
import { toFilterRows } from '../../../shared/dto/view.dto.js';
import { defaultColumnIds, recordColumns } from '../../../shared/mapper/record.mapper.jsx';
import { FILTER_LOGIC } from '../../../shared/enums/operator.enum.js';
import useWorkspace from '../hooks/useWorkspace.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import DataTable from '../../../core/components/table/DataTable.jsx';
import Pagination from '../../../core/components/ui/Pagination.jsx';
import Drawer from '../../../core/components/ui/Drawer.jsx';
import { FilterBar, FilterChips } from '../../../core/components/layout/FilterBar.jsx';
import StatusPill from '../../../core/components/ui/StatusPill.jsx';
import ConfirmDialog from '../../../core/components/ui/ConfirmDialog.jsx';
import SearchPlanPanel from '../../../core/components/record/SearchPlanPanel.jsx';
import { resolveIcon } from '../../../core/utils/icons.js';
import RecordToolbar from './components/RecordToolbar.jsx';
import RecordGridView from './components/RecordGridView.jsx';
import SaveViewDialog from '../views/SaveViewDialog.jsx';

/** Business screens 3 + 7 + 8 — record list with saved views, filters, sort, columns and layouts. */
export function RecordListPage() {
  const { oid } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const permission = usePermission(oid);
  const { object, fields } = useObject(oid);
  const { touch } = useWorkspace();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [logic, setLogic] = useState(FILTER_LOGIC.AND);
  const [activeViewId, setActiveViewId] = useState('');
  const [sortFieldId, setSortFieldId] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [columnIds, setColumnIds] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [selected, setSelected] = useState([]);
  const [archiving, setArchiving] = useState(null);
  const [savingView, setSavingView] = useState(false);
  const [busy, setBusy] = useState(false);
  const pager = usePagination();

  const views = useAsync(() => viewsApi.list(oid), [oid], { initialData: [] });
  const viewList = Array.isArray(views.data) ? views.data : [];

  const filtered = rows.length > 0;
  const search = useSearch();
  const plain = useRecords(oid, {
    page: pager.page,
    limit: pager.limit,
    sort: sortFieldId,
    order: sortOrder,
    status: 'ACTIVE',
  });

  useEffect(() => touch(oid), [oid, touch]);

  const visible = useMemo(() => permission.visibleFields(fields), [fields, permission]);

  useEffect(() => {
    if (visible.length && !columnIds.length) setColumnIds(defaultColumnIds(visible, 5));
  }, [visible, columnIds.length]);

  const columns = useMemo(
    () => recordColumns(visible, { columnIds, onSort: true }),
    [visible, columnIds],
  );

  const buildQuery = (page = pager.page) =>
    SearchQueryBuilder.for(oid)
      .filters(rows)
      .logic(logic)
      .sortBy(sortFieldId, sortOrder)
      .columns(columnIds)
      .paginate(page, pager.limit);

  const runFiltered = async (page = 1) => {
    pager.setPage(page);
    try {
      await search.run(buildQuery(page));
    } catch {
      /* surfaced through search.error */
    }
  };

  const applyView = async (viewId) => {
    setActiveViewId(viewId);
    const view = viewList.find((item) => item.viewId === viewId);
    if (!view) {
      setRows([]);
      search.reset();
      return;
    }
    setRows(toFilterRows(view));
    setLogic(view.logic || FILTER_LOGIC.AND);
    if (view.sort?.fieldId) {
      setSortFieldId(view.sort.fieldId);
      setSortOrder(view.sort.order || 'asc');
    }
    if (view.columns?.length) setColumnIds(view.columns);
    pager.setPage(1);
    try {
      await search.run(SearchQueryBuilder.fromView(view).paginate(1, pager.limit));
    } catch {
      /* surfaced through search.error */
    }
  };

  const records = filtered ? search.records : plain.records;
  const meta = filtered ? search.meta : plain.meta;
  const loading = filtered ? search.loading : plain.loading;
  const error = filtered ? search.error : plain.error;
  const retry = () => (filtered ? runFiltered(pager.page) : plain.reload());

  const changePage = (page) => {
    if (filtered) runFiltered(page);
    else pager.setPage(page);
  };

  const archive = async () => {
    setBusy(true);
    try {
      await recordsApi.archive(oid, archiving.recordId);
      toast.success('Record archived', 'You can restore it any time from the archive.');
      setArchiving(null);
      await retry();
    } catch (err) {
      toast.fromError(err, 'Could not archive record');
    } finally {
      setBusy(false);
    }
  };

  const rowActions = (record) => [
    {
      id: 'view',
      label: 'View record',
      icon: Eye,
      onSelect: () => navigate(`/business/objects/${oid}/records/${record.recordId}`),
    },
    {
      id: 'edit',
      label: 'Edit record',
      icon: Pencil,
      disabled: !permission.canUpdate,
      onSelect: () => navigate(`/business/objects/${oid}/records/${record.recordId}/edit`),
    },
    {
      id: 'archive',
      label: 'Archive record',
      icon: Archive,
      tone: 'danger',
      disabled: !permission.canDelete,
      onSelect: () => setArchiving(record),
    },
  ];

  const Icon = resolveIcon(object?.icon);
  const sortableFields = visible.filter((field) => field.sortable !== false);

  return (
    <>
      <PageHeader
        title={object?.pluralLabel || object?.label || 'Records'}
        subtitle={`${(meta?.total ?? records.length).toLocaleString('en-IN')} records found`}
        icon={Icon}
        breadcrumbs={[{ label: 'My Objects', to: '/business/objects' }, { label: object?.label ?? oid }]}
      />

      <div className="mb-4">
        <RecordToolbar
          objectId={oid}
          views={viewList}
          activeViewId={activeViewId}
          onViewChange={applyView}
          onToggleFilters={() => setFiltersOpen(true)}
          filterCount={rows.length}
          sortFieldId={sortFieldId}
          sortOrder={sortOrder}
          sortableFields={sortableFields}
          onSortChange={(fieldId, order) => {
            setSortFieldId(fieldId);
            setSortOrder(order);
            if (filtered) runFiltered(1);
          }}
          fields={visible}
          columnIds={columnIds}
          onColumnsChange={setColumnIds}
          onColumnsReset={() => setColumnIds(defaultColumnIds(visible, 5))}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          canCreate={permission.canCreate}
          selectedCount={selected.length}
          onBulk={() => navigate(`/business/objects/${oid}/bulk`)}
        />
      </div>

      {rows.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <FilterChips
            rows={rows}
            fields={visible}
            onRemove={(id) => {
              const next = rows.filter((row) => row.id !== id);
              setRows(next);
              if (!next.length) search.reset();
            }}
          />
          {search.plan && <SearchPlanPanel plan={search.plan} />}
        </div>
      )}

      {viewMode === 'list' ? (
        <Card>
          <DataTable
            columns={columns}
            rows={records}
            rowKey={(record) => record.recordId}
            loading={loading}
            error={error}
            onRetry={retry}
            selectable
            selectedIds={selected}
            onSelectionChange={setSelected}
            rowActions={rowActions}
            onRowClick={(record) => navigate(`/business/objects/${oid}/records/${record.recordId}`)}
            sort={{ key: sortFieldId, order: sortOrder }}
            onSortChange={({ key, order }) => {
              setSortFieldId(key);
              setSortOrder(order);
              if (filtered) runFiltered(1);
            }}
            emptyIcon={Table2}
            emptyTitle={filtered ? 'No records matched your filters' : 'No records yet'}
            emptyDescription={
              filtered
                ? 'Loosen a filter or clear them all.'
                : 'Create the first record for this object.'
            }
          />
          <Pagination
            page={pager.page}
            limit={pager.limit}
            total={meta?.total ?? records.length}
            totalPages={meta?.totalPages}
            onPageChange={changePage}
            onLimitChange={(limit) => {
              pager.setLimit(limit);
              if (filtered) runFiltered(1);
            }}
          />
        </Card>
      ) : (
        <RecordGridView
          objectId={oid}
          fields={visible.filter((field) => columnIds.includes(field.fieldId))}
          records={records}
          loading={loading}
          error={error}
          onRetry={retry}
          columns={viewMode === 'board' ? 2 : 3}
        />
      )}

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        subtitle={`Find ${object?.pluralLabel ?? 'records'} using filters`}
        size="lg"
      >
        <FilterBar
          fields={visible}
          rows={rows}
          logic={logic}
          onLogicChange={setLogic}
          onChange={setRows}
          onClear={() => {
            setRows([]);
            setActiveViewId('');
            search.reset();
          }}
          onSaveView={() => setSavingView(true)}
          onSearch={() => {
            setFiltersOpen(false);
            runFiltered(1);
          }}
          searching={search.loading}
        />
      </Drawer>

      <SaveViewDialog
        open={savingView}
        onClose={() => setSavingView(false)}
        builder={buildQuery(1)}
        onSaved={async () => {
          setSavingView(false);
          await views.reload();
          toast.success('View saved', 'Find it under My Views');
        }}
      />

      <ConfirmDialog
        open={Boolean(archiving)}
        onClose={() => setArchiving(null)}
        title="Archive Record"
        description="This record will be archived and hidden from active views."
        note="You can restore this record anytime from the archive."
        confirmLabel="Archive Record"
        loading={busy}
        onConfirm={archive}
      >
        {archiving && (
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">{archiving.displayName}</p>
              <p className="truncate font-mono text-[11px] text-slate-400">{archiving.recordId}</p>
            </div>
            <StatusPill kind="record" status={archiving.status} className="ml-auto" />
          </div>
        )}
      </ConfirmDialog>
    </>
  );
}

export default RecordListPage;
