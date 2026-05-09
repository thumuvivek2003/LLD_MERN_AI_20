import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { borrowApi } from '../../api/borrowApi';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const BorrowHistory = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [returnModal, setReturnModal] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['borrowHistory', page],
    queryFn: () => borrowApi.getBorrowHistory({ page, limit: 10 }).then((r) => r.data.data),
  });

  const returnMutation = useMutation({
    mutationFn: (id) => borrowApi.returnBook(id),
    onSuccess: (res) => {
      const { fineAmount } = res.data.data;
      if (fineAmount > 0) {
        toast.error(`Book returned. Fine: $${fineAmount.toFixed(2)} for overdue.`);
      } else {
        toast.success('Book returned successfully!');
      }
      queryClient.invalidateQueries(['borrowHistory']);
      queryClient.invalidateQueries(['books']);
      setReturnModal(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Return failed.'),
  });

  const records = data?.records || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Borrows</h1>
        <p className="text-gray-500 text-sm">Your borrowing history and active borrows</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Book', 'Borrow Date', 'Due Date', 'Return Date', 'Fine', 'Status', 'Action'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {records.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No borrow records found.</td></tr>
              )}
              {records.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 line-clamp-1">{r.bookId?.title}</p>
                    <p className="text-gray-500 text-xs">{r.bookId?.author}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{format(new Date(r.borrowDate), 'MMM d, yyyy')}</td>
                  <td className="px-6 py-4 text-gray-600">{format(new Date(r.dueDate), 'MMM d, yyyy')}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {r.returnDate ? format(new Date(r.returnDate), 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="px-6 py-4">
                    {r.fineAmount > 0 ? (
                      <span className="text-red-600 font-medium">${r.fineAmount.toFixed(2)}</span>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-4"><Badge label={r.status} /></td>
                  <td className="px-6 py-4">
                    {(r.status === 'ACTIVE' || r.status === 'OVERDUE') && (
                      <Button size="sm" variant="secondary" onClick={() => setReturnModal(r)}>
                        Return
                      </Button>
                    )}
                  </td>
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

      <Modal isOpen={!!returnModal} onClose={() => setReturnModal(null)} title="Return Book">
        {returnModal && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Return <strong>{returnModal.bookId?.title}</strong>?
              {new Date() > new Date(returnModal.dueDate) && (
                <span className="text-red-600 block mt-1 text-xs">⚠ This book is overdue. A fine will be calculated.</span>
              )}
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setReturnModal(null)}>Cancel</Button>
              <Button loading={returnMutation.isPending} onClick={() => returnMutation.mutate(returnModal._id)}>
                Confirm Return
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BorrowHistory;
