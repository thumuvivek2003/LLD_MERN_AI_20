import { Table } from '../../../shared/components/Table.jsx';
import { formatDate } from '../../../shared/utils/formatDate.js';

export function RetryQueueTable({ jobs = [] }) {
  const columns = [
    {
      key: 'id',
      header: 'Job',
      render: (j) => (
        <span className="font-mono text-xs">{(j.id || '').slice(0, 8)}</span>
      ),
    },
    {
      key: 'notificationId',
      header: 'Notification',
      render: (j) => (
        <span className="font-mono text-xs">
          {(j.notificationId || '').slice(0, 8)}
        </span>
      ),
    },
    {
      key: 'attempt',
      header: 'Attempt',
      render: (j) => <span className="text-sm">#{j.attempt ?? 1}</span>,
    },
    {
      key: 'scheduledAt',
      header: 'Scheduled',
      render: (j) => (
        <span className="text-xs text-slate-500">
          {formatDate(j.scheduledAt)}
        </span>
      ),
    },
  ];
  return (
    <Table columns={columns} rows={jobs} emptyText="No retry jobs scheduled." />
  );
}
