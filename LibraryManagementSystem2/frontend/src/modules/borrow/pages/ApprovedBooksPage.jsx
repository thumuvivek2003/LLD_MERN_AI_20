import { useBorrowRequests } from '../hooks/useBorrowRequests.js';
import Table from '../../../shared/components/ui/Table.jsx';
import Button from '../../../shared/components/ui/Button.jsx';
import Loader from '../../../shared/components/ui/Loader.jsx';
import { returnBook } from '../services/borrowService.js';
import { formatDate } from '../../../shared/utils/dateFormatter.js';

export default function ApprovedBooksPage() {
  const { requests, loading, refetch } = useBorrowRequests();
  const approved = requests.filter((r) => r.status === 'APPROVED');

  const handleReturn = async (id) => { await returnBook(id); refetch(); };

  const columns = [
    { key: 'book', label: 'Book', render: (r) => r.book?.title },
    { key: 'dueDate', label: 'Due Date', render: (r) => formatDate(r.dueDate) },
    { key: 'actions', label: '', render: (r) => <Button onClick={() => handleReturn(r._id)}>Return</Button> },
  ];

  if (loading) return <Loader />;
  return (
    <div className="page-container">
      <h1 className="page-title">My Approved Borrows</h1>
      <Table columns={columns} data={approved} />
    </div>
  );
}
