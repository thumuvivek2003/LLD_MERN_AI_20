import { useBorrowRequests } from '../hooks/useBorrowRequests.js';
import Table from '../../../shared/components/ui/Table.jsx';
import Loader from '../../../shared/components/ui/Loader.jsx';
import { formatDate } from '../../../shared/utils/dateFormatter.js';

export default function ReturnedBooksPage() {
  const { requests, loading } = useBorrowRequests();
  const returned = requests.filter((r) => r.status === 'RETURNED');

  const columns = [
    { key: 'book', label: 'Book', render: (r) => r.book?.title },
    { key: 'borrowDate', label: 'Borrowed', render: (r) => formatDate(r.borrowDate) },
    { key: 'returnDate', label: 'Returned', render: (r) => formatDate(r.returnDate) },
  ];

  if (loading) return <Loader />;
  return (
    <div className="page-container">
      <h1 className="page-title">Returned Books</h1>
      <Table columns={columns} data={returned} />
    </div>
  );
}
