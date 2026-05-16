import { Table } from '../../../shared/components/Table.jsx';
import { StatusPill } from '../../../shared/components/StatusPill.jsx';
import { formatDate } from '../../../shared/utils/formatDate.js';

export function DeliveryLogTable({ logs = [] }) {
  const columns = [
    {
      key: 'at',
      header: 'When',
      render: (l) => (
        <span className="text-xs text-slate-500">{formatDate(l.at || l.timestamp)}</span>
      ),
    },
    {
      key: 'notificationId',
      header: 'Notification',
      render: (l) => (
        <span className="font-mono text-xs">{(l.notificationId || l.id || '').slice(0, 8)}</span>
      ),
    },
    { key: 'channel', header: 'Channel' },
    {
      key: 'status',
      header: 'Status',
      render: (l) => <StatusPill status={l.status} />,
    },
    {
      key: 'error',
      header: 'Error',
      render: (l) => (
        <span className="text-xs text-red-600">{l.error || '—'}</span>
      ),
    },
  ];
  return <Table columns={columns} rows={logs} emptyText="No log entries." />;
}
