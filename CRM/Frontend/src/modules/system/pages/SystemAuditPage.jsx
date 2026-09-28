import { useState } from 'react';
import { FileClock } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import usePagination from '../../../core/hooks/usePagination.js';
import auditApi from '../../../core/api/audit.api.js';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import { AUDIT_ACTION_LABEL, AUDIT_ACTION_LIST } from '../../../shared/enums/audit-action.enum.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import { Input } from '../../../core/components/ui/Input.jsx';
import Pagination from '../../../core/components/ui/Pagination.jsx';
import AuditTable from '../../../core/components/table/AuditTable.jsx';

/** System → Audit Logs. The unfiltered platform audit trail. */
export function SystemAuditPage() {
  const { objects } = useMetadata();
  const [objectId, setObjectId] = useState('');
  const [action, setAction] = useState('');
  const [from, setFrom] = useState('');
  const pager = usePagination({ initialLimit: 50 });

  const { data, loading, error, reload } = useAsync(
    () =>
      auditApi.list({
        page: pager.page,
        limit: pager.limit,
        ...(objectId ? { objectId } : {}),
        ...(action ? { action } : {}),
        ...(from ? { from } : {}),
      }),
    [pager.page, pager.limit, objectId, action, from],
    { initialData: [] },
  );

  const entries = Array.isArray(data) ? data : [];

  return (
    <>
      <PageHeader
        title="Audit Logs"
        subtitle="Every mutation the platform recorded"
        icon={FileClock}
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
            options={AUDIT_ACTION_LIST.map((value) => ({ value, label: AUDIT_ACTION_LABEL[value] }))}
          />
          <Input
            type="date"
            className="w-44"
            value={from}
            onChange={(event) => {
              setFrom(event.target.value);
              pager.reset();
            }}
          />
        </div>

        <AuditTable entries={entries} loading={loading} error={error} onRetry={reload} dense />

        <Pagination
          page={pager.page}
          limit={pager.limit}
          total={entries.meta?.total ?? entries.length}
          totalPages={entries.meta?.totalPages}
          onPageChange={pager.setPage}
          onLimitChange={pager.setLimit}
          limitOptions={[25, 50, 100, 200]}
        />
      </Card>
    </>
  );
}

export default SystemAuditPage;
