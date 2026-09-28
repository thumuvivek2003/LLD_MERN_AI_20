import { FileClock } from 'lucide-react';
import { AUDIT_ACTION_LABEL, AUDIT_ACTION_TONE } from '../../../shared/enums/audit-action.enum.js';
import { formatDateTime } from '../../utils/formatters.js';
import DataTable from './DataTable.jsx';
import Badge from '../ui/Badge.jsx';

/** `GET /audit` rows — shared by Admin → Audit Log, Business → Activity, System → Audit Logs. */
export function AuditTable({ entries = [], loading, error, onRetry, dense = false }) {
  const columns = [
    {
      key: 'at',
      header: 'Time',
      className: 'whitespace-nowrap font-semibold text-slate-800',
      render: (entry) => formatDateTime(entry.at),
    },
    { key: 'userName', header: 'User', render: (entry) => entry.userName || entry.userId || 'System' },
    {
      key: 'action',
      header: 'Action',
      render: (entry) => (
        <Badge tone={AUDIT_ACTION_TONE[entry.action] || 'slate'}>
          {AUDIT_ACTION_LABEL[entry.action] || entry.action}
        </Badge>
      ),
    },
    { key: 'objectLabel', header: 'Object', render: (entry) => entry.objectLabel || '—' },
    {
      key: 'recordDisplayName',
      header: 'Record',
      render: (entry) => entry.recordDisplayName || entry.recordId || '—',
    },
    {
      key: 'summary',
      header: 'Details',
      render: (entry) => <span className="text-slate-500">{entry.summary || '—'}</span>,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={entries}
      rowKey={(entry, index) => entry.auditId ?? index}
      loading={loading}
      error={error}
      onRetry={onRetry}
      dense={dense}
      emptyIcon={FileClock}
      emptyTitle="No audit entries"
      emptyDescription="Nothing matches these filters yet."
    />
  );
}

export default AuditTable;
