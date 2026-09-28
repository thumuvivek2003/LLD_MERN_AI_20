import { useState } from 'react';
import { FileClock } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import usePagination from '../../../core/hooks/usePagination.js';
import auditApi from '../../../core/api/audit.api.js';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import { useUser } from '../../../core/context/UserContext.jsx';
import { AUDIT_ACTION_LABEL, AUDIT_ACTION_LIST } from '../../../shared/enums/audit-action.enum.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import { Input } from '../../../core/components/ui/Input.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import Pagination from '../../../core/components/ui/Pagination.jsx';
import AuditTable from '../../../core/components/table/AuditTable.jsx';

const EMPTY = { objectId: '', action: '', userId: '', from: '', to: '' };

/** Admin screen 17 — Audit log with object / action / user / date-range filters. */
export function AuditLogPage() {
  const { objects } = useMetadata();
  const { users } = useUser();
  const [filters, setFilters] = useState(EMPTY);
  const pager = usePagination();

  const { data, loading, error, reload } = useAsync(
    () =>
      auditApi.list({
        page: pager.page,
        limit: pager.limit,
        ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value)),
      }),
    [pager.page, pager.limit, filters],
    { initialData: [] },
  );

  const entries = Array.isArray(data) ? data : [];
  const patch = (changes) => {
    setFilters((current) => ({ ...current, ...changes }));
    pager.reset();
  };

  return (
    <>
      <PageHeader title="Audit Log" subtitle="Track all changes in the platform" icon={FileClock} />

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
          <Select
            className="w-44"
            value={filters.objectId}
            placeholder="All Objects"
            onChange={(event) => patch({ objectId: event.target.value })}
            options={objects.map((object) => ({ value: object.objectId, label: object.label }))}
          />
          <Select
            className="w-44"
            value={filters.action}
            placeholder="All Actions"
            onChange={(event) => patch({ action: event.target.value })}
            options={AUDIT_ACTION_LIST.map((action) => ({
              value: action,
              label: AUDIT_ACTION_LABEL[action],
            }))}
          />
          <Select
            className="w-44"
            value={filters.userId}
            placeholder="All Users"
            onChange={(event) => patch({ userId: event.target.value })}
            options={users.map((user) => ({ value: user.userId, label: user.name }))}
          />
          <div className="flex items-center gap-2">
            <Input
              type="date"
              className="w-40"
              value={filters.from}
              onChange={(event) => patch({ from: event.target.value })}
            />
            <span className="text-xs text-slate-400">to</span>
            <Input
              type="date"
              className="w-40"
              value={filters.to}
              onChange={(event) => patch({ to: event.target.value })}
            />
          </div>
          <Button variant="ghost" size="sm" onClick={() => patch(EMPTY)}>
            Clear
          </Button>
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

export default AuditLogPage;
