import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fineApi } from '../../api/fineApi';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { format } from 'date-fns';

const AllFines = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['allFines', page, statusFilter],
    queryFn: () => fineApi.getAllFines({ page, limit: 15, status: statusFilter || undefined }).then((r) => r.data.data),
  });

  const fines = data?.fines || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Fines</h1>
          <p className="text-gray-500 text-sm">Admin view of all library fines</p>
        </div>
        <select className="input-field w-36" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Member', 'Book', 'Days Overdue', 'Amount', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {fines.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No fines found.</td></tr>
              )}
              {fines.map((f) => (
                <tr key={f._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{f.userId?.name}</p>
                    <p className="text-gray-500 text-xs">{f.userId?.email}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 line-clamp-1">{f.bookId?.title}</td>
                  <td className="px-6 py-4 text-red-600 font-medium">{f.daysOverdue} days</td>
                  <td className="px-6 py-4 font-bold">${f.amount.toFixed(2)}</td>
                  <td className="px-6 py-4"><Badge label={f.status} /></td>
                  <td className="px-6 py-4 text-gray-600">{format(new Date(f.createdAt), 'MMM d, yyyy')}</td>
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

export default AllFines;
