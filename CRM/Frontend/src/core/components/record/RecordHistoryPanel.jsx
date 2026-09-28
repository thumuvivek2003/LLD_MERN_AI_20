import { History } from 'lucide-react';
import { AUDIT_ACTION_LABEL, AUDIT_ACTION_TONE } from '../../../shared/enums/audit-action.enum.js';
import { formatDateTime } from '../../utils/formatters.js';
import DataTable from '../table/DataTable.jsx';
import Badge from '../ui/Badge.jsx';

/** `GET /objects/:oid/records/:rid/history` — the record's audit trail. */
export function RecordHistoryPanel({ entries = [], loading, error, onRetry }) {
  const columns = [
    {
      key: 'at',
      header: 'Date & Time',
      className: 'font-semibold text-slate-800 whitespace-nowrap',
      render: (entry) => formatDateTime(entry.at),
    },
    { key: 'userName', header: 'User', render: (entry) => entry.userName || entry.userId },
    {
      key: 'action',
      header: 'Action',
      render: (entry) => (
        <Badge tone={AUDIT_ACTION_TONE[entry.action] || 'slate'}>
          {AUDIT_ACTION_LABEL[entry.action] || entry.action}
        </Badge>
      ),
    },
    {
      key: 'changes',
      header: 'Changes',
      render: (entry) =>
        entry.changes?.length ? (
          <ul className="space-y-0.5">
            {entry.changes.map((change, index) => (
              <li key={index} className="text-xs text-slate-600">
                <span className="font-medium text-slate-700">{change.label || change.fieldId}</span>
                {': '}
                <span className="text-slate-400 line-through">{String(change.from ?? '—')}</span>
                {' → '}
                <span className="text-slate-700">{String(change.to ?? '—')}</span>
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-xs text-slate-500">{entry.summary || '—'}</span>
        ),
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
      dense
      emptyIcon={History}
      emptyTitle="No history yet"
      emptyDescription="Edits to this record will be listed here."
    />
  );
}

export default RecordHistoryPanel;
