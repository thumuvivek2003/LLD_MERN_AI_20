import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import useObject from '../../../core/hooks/useObject.js';
import useSearch from '../../../core/hooks/useSearch.js';
import usePagination from '../../../core/hooks/usePagination.js';
import usePermission from '../../../core/hooks/usePermission.js';
import SearchQueryBuilder from '../../../core/utils/queryBuilder.js';
import { FILTER_LOGIC } from '../../../shared/enums/operator.enum.js';
import { recordColumns } from '../../../shared/mapper/record.mapper.jsx';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import { FilterBar, FilterChips } from '../../../core/components/layout/FilterBar.jsx';
import DataTable from '../../../core/components/table/DataTable.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import Pagination from '../../../core/components/ui/Pagination.jsx';
import { EmptyState } from '../../../core/components/ui/EmptyState.jsx';
import SearchPlanPanel from '../../../core/components/record/SearchPlanPanel.jsx';

/** Admin screen 14 — Search & filter records, with filter chips and the query plan. */
export function AdminSearchPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { objects } = useMetadata();
  const objectId = params.get('objectId') || '';

  const { fields } = useObject(objectId);
  const permission = usePermission(objectId);
  const search = useSearch();
  const pager = usePagination();

  const [rows, setRows] = useState([]);
  const [logic, setLogic] = useState(FILTER_LOGIC.AND);

  useEffect(() => {
    if (!objectId && objects.length) setParams({ objectId: objects[0].objectId });
  }, [objects, objectId, setParams]);

  useEffect(() => {
    setRows([]);
    search.reset();
    pager.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectId]);

  const visible = useMemo(() => permission.visibleFields(fields), [fields, permission]);
  const columns = useMemo(() => recordColumns(visible.slice(0, 6)), [visible]);

  const buildQuery = (page = 1) =>
    SearchQueryBuilder.for(objectId).filters(rows).logic(logic).paginate(page, pager.limit);

  const run = async (page = 1) => {
    if (!objectId) return;
    pager.setPage(page);
    try {
      await search.run(buildQuery(page));
    } catch {
      /* surfaced by search.error */
    }
  };

  return (
    <>
      <PageHeader
        title="Search Records"
        subtitle="Query the index layer — never a collection scan"
        icon={Search}
      />

      <Card className="mb-5">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
          <Select
            className="w-56"
            value={objectId}
            placeholder="Select object"
            onChange={(event) => setParams({ objectId: event.target.value })}
            options={objects.map((object) => ({ value: object.objectId, label: object.label }))}
          />
          {rows.length > 0 && (
            <FilterChips
              rows={rows}
              fields={visible}
              onRemove={(id) => setRows(rows.filter((row) => row.id !== id))}
            />
          )}
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
            onRowClick={(record) => navigate(`/admin/records/${objectId}/${record.recordId}`)}
            emptyIcon={Filter}
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
            title="Build a query to begin"
            description="Add one or more filters above, then press Search. Every predicate is served from an index."
          />
        </Card>
      )}
    </>
  );
}

export default AdminSearchPage;
