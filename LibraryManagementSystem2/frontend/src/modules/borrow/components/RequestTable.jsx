import Table from '../../../shared/components/ui/Table.jsx';
import Button from '../../../shared/components/ui/Button.jsx';
import BorrowStatusBadge from './BorrowStatusBadge.jsx';
import { formatDate } from '../../../shared/utils/dateFormatter.js';

export default function RequestTable({ requests, onApprove, onReject }) {
  const columns = [
    { key: 'book', label: 'Book', render: (r) => r.book?.title },
    { key: 'user', label: 'User', render: (r) => r.user?.name },
    { key: 'status', label: 'Status', render: (r) => <BorrowStatusBadge status={r.status} /> },
    { key: 'createdAt', label: 'Requested', render: (r) => formatDate(r.createdAt) },
    {
      key: 'actions', label: 'Actions',
      render: (r) => r.status === 'PENDING' ? (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button onClick={() => onApprove(r._id)} variant="success">Approve</Button>
          <Button onClick={() => onReject(r._id)} variant="danger">Reject</Button>
        </div>
      ) : null,
    },
  ];
  return <Table columns={columns} data={requests} />;
}
