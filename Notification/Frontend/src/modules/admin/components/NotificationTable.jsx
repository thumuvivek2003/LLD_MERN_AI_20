import { Link } from 'react-router-dom';
import { Table } from '../../../shared/components/Table.jsx';
import { StatusPill } from '../../../shared/components/StatusPill.jsx';
import { RetryNotificationButton } from './RetryNotificationButton.jsx';
import { formatDate } from '../../../shared/utils/formatDate.js';

export function NotificationTable({ notifications, onRetried }) {
  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (n) => (
        <Link
          to={`/admin/notifications/${n.id}`}
          className="font-mono text-xs text-brand-700 hover:underline"
        >
          {n.id?.slice(0, 8) || '—'}
        </Link>
      ),
    },
    {
      key: 'user',
      header: 'User',
      render: (n) => (
        <div>
          <div className="text-sm text-slate-800">
            {n.user?.name || n.userId}
          </div>
          <div className="text-xs text-slate-400">
            {n.user?.email || n.user?.phone || ''}
          </div>
        </div>
      ),
    },
    { key: 'channel', header: 'Channel' },
    { key: 'eventType', header: 'Event' },
    {
      key: 'status',
      header: 'Status',
      render: (n) => <StatusPill status={n.status} />,
    },
    {
      key: 'retryCount',
      header: 'Retries',
      render: (n) => <span className="text-sm">{n.retryCount ?? 0}</span>,
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (n) => (
        <span className="text-xs text-slate-500">{formatDate(n.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (n) => (
        <RetryNotificationButton
          notificationId={n.id}
          status={n.status}
          onRetried={onRetried}
        />
      ),
      className: 'text-right',
    },
  ];

  return (
    <Table
      columns={columns}
      rows={notifications || []}
      emptyText="No notifications match these filters."
    />
  );
}
