import { useState } from 'react';
import { History } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import usePagination from '../../../core/hooks/usePagination.js';
import auditApi from '../../../core/api/audit.api.js';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import { useUser } from '../../../core/context/UserContext.jsx';
import { AUDIT_ACTION_LABEL, AUDIT_ACTION_LIST } from '../../../shared/enums/audit-action.enum.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import { Toggle } from '../../../core/components/ui/Toggle.jsx';
import Pagination from '../../../core/components/ui/Pagination.jsx';
import AuditTable from '../../../core/components/table/AuditTable.jsx';

/** Business screen 15 — Activity / audit trail across everything the user can see. */
export function ActivityPage() {
  const { objects } = useMetadata();
  const { userId } = useUser();
  const [objectId, setObjectId] = useState('');
  const [action, setAction] = useState('');
  const [mineOnly, setMineOnly] = useState(false);
  const pager = usePagination();

  const { data, loading, error, reload } = useAsync(
    () =>
      auditApi.list({
        page: pager.page,
        limit: pager.limit,
        ...(objectId ? { objectId } : {}),
        ...(action ? { action } : {}),
        ...(mineOnly ? { userId } : {}),
      }),
    [pager.page, pager.limit, objectId, action, mineOnly, userId],
    { initialData: [] },
  );

  const entries = Array.isArray(data) ? data : [];

  return (
    <>
      <PageHeader
        title="Activity History"
        subtitle="Every change made to the records you can see"
        icon={History}
      />

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
          <Select
            className="w-48"
            value={objectId}
            placeholder="All Objects"
            onChange={(event) => {
              setObjectId(event.target.value);
              pager.reset();
            }}
            options={objects.map((object) => ({ value: object.objectId, label: object.label }))}
          />
          <Select
            className="w-44"
            value={action}
            placeholder="All Actions"
            onChange={(event) => {
              setAction(event.target.value);
              pager.reset();
            }}
            options={AUDIT_ACTION_LIST.map((value) => ({
              value,
              label: AUDIT_ACTION_LABEL[value],
            }))}
          />
          <label className="ml-auto flex items-center gap-2 text-xs font-semibold text-slate-600">
            Only my changes
            <Toggle
              size="sm"
              checked={mineOnly}
              onChange={(value) => {
                setMineOnly(value);
                pager.reset();
              }}
            />
          </label>
        </div>

        <AuditTable entries={entries} loading={loading} error={error} onRetry={reload} />

        <Pagination
          page={pager.page}
          limit={pager.limit}
          total={entries.meta?.total ?? entries.length}
          totalPages={entries.meta?.totalPages}
          onPageChange={pager.setPage}
          onLimitChange={pager.setLimit}
        />
      </Card>
    </>
  );
}

export default ActivityPage;
