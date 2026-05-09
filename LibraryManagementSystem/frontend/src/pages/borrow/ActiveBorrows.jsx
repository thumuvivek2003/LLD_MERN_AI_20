import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { borrowApi } from '../../api/borrowApi';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { format, isPast } from 'date-fns';

const ActiveBorrows = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['activeBorrows', page],
    queryFn: () => borrowApi.getAllActiveBorrows({ page, limit: 15 }).then((r) => r.data.data),
  });

  const records = data?.records || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Active Borrows</h1>
        <p className="text-gray-500 text-sm">Admin view of all active borrowing records</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Member', 'Book', 'Borrowed', 'Due Date', 'Status'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {records.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">No active borrows.</td></tr>
              )}
              {records.map((r) => (
                <tr key={r._id} className={`hover:bg-gray-50 transition ${isPast(new Date(r.dueDate)) ? 'bg-red-50/40' : ''}`}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{r.userId?.name}</p>
                    <p className="text-gray-500 text-xs">{r.userId?.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 line-clamp-1">{r.bookId?.title}</p>
                    <p className="text-gray-500 text-xs">{r.bookId?.author}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{format(new Date(r.borrowDate), 'MMM d, yyyy')}</td>
                  <td className={`px-6 py-4 font-medium ${isPast(new Date(r.dueDate)) ? 'text-red-600' : 'text-gray-600'}`}>
                    {format(new Date(r.dueDate), 'MMM d, yyyy')}
                    {isPast(new Date(r.dueDate)) && <span className="block text-xs">Overdue</span>}
                  </td>
                  <td className="px-6 py-4"><Badge label={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {data?.pages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
              <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <span className="flex items-center text-sm text-gray-600 px-2">Page {data.page} of {data.pages}</span>
              <Button variant="secondary" size="sm" disabled={page === data.pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActiveBorrows;
