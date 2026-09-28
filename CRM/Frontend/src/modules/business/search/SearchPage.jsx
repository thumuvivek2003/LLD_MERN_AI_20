import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import { useToast } from '../../../core/context/ToastContext.jsx';
import useObject from '../../../core/hooks/useObject.js';
import useSearch from '../../../core/hooks/useSearch.js';
import usePagination from '../../../core/hooks/usePagination.js';
import usePermission from '../../../core/hooks/usePermission.js';
import SearchQueryBuilder from '../../../core/utils/queryBuilder.js';
import { FILTER_LOGIC } from '../../../shared/enums/operator.enum.js';
import { defaultColumnIds, recordColumns } from '../../../shared/mapper/record.mapper.jsx';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import { FilterBar } from '../../../core/components/layout/FilterBar.jsx';
import DataTable from '../../../core/components/table/DataTable.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import Pagination from '../../../core/components/ui/Pagination.jsx';
import { EmptyState } from '../../../core/components/ui/EmptyState.jsx';
import SearchPlanPanel from '../../../core/components/record/SearchPlanPanel.jsx';
import SaveViewDialog from '../views/SaveViewDialog.jsx';

/** Business screen 7 — Search & Filter with the filter-row builder and Save View. */
export function SearchPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const { objects } = useMetadata();
  const objectId = params.get('objectId') || '';

  const { object, fields } = useObject(objectId);
  const permission = usePermission(objectId);
  const search = useSearch();
  const pager = usePagination();

  const [rows, setRows] = useState([]);
  const [logic, setLogic] = useState(FILTER_LOGIC.AND);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!objectId && objects.length) setParams({ objectId: objects[0].objectId });
  }, [objects, objectId, setParams]);

  useEffect(() => {
    setRows([]);
    search.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectId]);

  const visible = useMemo(() => permission.visibleFields(fields), [fields, permission]);
  const columns = useMemo(() => recordColumns(visible.slice(0, 6)), [visible]);

  const buildQuery = (page = 1) =>
    SearchQueryBuilder.for(objectId)
      .filters(rows)
      .logic(logic)
      .columns(defaultColumnIds(visible, 6))
      .paginate(page, pager.limit);

  const run = async (page = 1) => {
    if (!objectId) return;
    pager.setPage(page);
    try {
      await search.run(buildQuery(page));
    } catch {
      /* surfaced through search.error */
    }
  };

  return (
    <>
      <PageHeader
        title="Search & Filter"
        subtitle="Find records using filters — every predicate is served from an index"
        icon={Search}
      />

      <Card className="mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
          <Select
            className="w-56"
            value={objectId}
            placeholder="Select object"
            onChange={(event) => setParams({ objectId: event.target.value })}
            options={objects.map((item) => ({
              value: item.objectId,
              label: item.pluralLabel || item.label,
            }))}
          />
          <button
            type="button"
            disabled={!rows.length}
            onClick={() => setSaving(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent transition hover:underline disabled:cursor-not-allowed disabled:text-slate-300 disabled:no-underline"
          >
            <Star size={13} /> Save View
          </button>
        </div>

        <div className="p-5">
          <FilterBar
            fields={visible}
            rows={rows}
            logic={logic}
            onLogicChange={setLogic}
            onChange={setRows}
            onClear={() => {
              setRows([]);
              search.reset();
            }}
            onSearch={() => run(1)}
            searching={search.loading}
          />
        </div>
      </Card>

      {search.ran ? (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
            <p className="text-sm font-semibold text-slate-800">
              Results ({(search.meta?.total ?? search.records.length).toLocaleString('en-IN')})
            </p>
            <SearchPlanPanel plan={search.plan} />
          </div>

          <DataTable
            columns={columns}
            rows={search.records}
            rowKey={(record) => record.recordId}
            loading={search.loading}
            error={search.error}
            onRetry={() => run(pager.page)}
            onRowClick={(record) =>
              navigate(`/business/objects/${objectId}/records/${record.recordId}`)
            }
            emptyIcon={Search}
            emptyTitle="No records matched"
            emptyDescription="Loosen a filter or try a different operator."
          />

          <Pagination
            page={pager.page}
            limit={pager.limit}
            total={search.meta?.total ?? 0}
            totalPages={search.meta?.totalPages}
            onPageChange={(page) => run(page)}
            onLimitChange={(limit) => {
              pager.setLimit(limit);
              run(1);
            }}
          />
        </Card>
      ) : (
        <Card>
          <EmptyState
            icon={Search}
            title={`Search ${object?.pluralLabel ?? 'records'}`}
            description="Add a filter row above, then press Search."
          />
        </Card>
      )}

      <SaveViewDialog
        open={saving}
        onClose={() => setSaving(false)}
        builder={buildQuery(1)}
        onSaved={() => {
          setSaving(false);
          toast.success('View saved', 'Find it under My Views');
        }}
      />
    </>
  );
}

export default SearchPage;
