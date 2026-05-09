import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fineApi } from '../../api/fineApi';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Fines = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [payModal, setPayModal] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['myFines', page],
    queryFn: () => fineApi.getUserFines({ page, limit: 10 }).then((r) => r.data.data),
  });

  const payMutation = useMutation({
    mutationFn: (id) => fineApi.payFine(id),
    onSuccess: () => {
      toast.success('Fine paid successfully!');
      queryClient.invalidateQueries(['myFines']);
      setPayModal(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Payment failed.'),
  });

  const fines = data?.fines || [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Fines</h1>
          <p className="text-gray-500 text-sm">Overdue fines for late book returns</p>
        </div>
        {data?.pendingTotal > 0 && (
          <div className="card bg-red-50 border-red-100 py-3 px-5">
            <p className="text-xs text-red-600 font-medium">Total Pending</p>
            <p className="text-xl font-bold text-red-700">${data.pendingTotal.toFixed(2)}</p>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Book', 'Days Overdue', 'Fine Amount', 'Generated', 'Paid On', 'Status', 'Action'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {fines.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No fines found. Great record!</td></tr>
              )}
              {fines.map((f) => (
                <tr key={f._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 line-clamp-1">{f.bookId?.title}</p>
                    <p className="text-gray-500 text-xs">{f.bookId?.author}</p>
                  </td>
                  <td className="px-6 py-4 text-red-600 font-medium">{f.daysOverdue} days</td>
                  <td className="px-6 py-4 font-bold text-gray-900">${f.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-600">{format(new Date(f.createdAt), 'MMM d, yyyy')}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {f.paidDate ? format(new Date(f.paidDate), 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="px-6 py-4"><Badge label={f.status} /></td>
                  <td className="px-6 py-4">
                    {f.status === 'PENDING' && (
                      <Button size="sm" onClick={() => setPayModal(f)}>Pay Fine</Button>
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

      <Modal isOpen={!!payModal} onClose={() => setPayModal(null)} title="Pay Fine">
        {payModal && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Book</span><span className="font-medium">{payModal.bookId?.title}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Days Overdue</span><span className="text-red-600 font-medium">{payModal.daysOverdue} days</span></div>
              <div className="flex justify-between text-base font-bold"><span>Total Fine</span><span className="text-red-600">${payModal.amount.toFixed(2)}</span></div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setPayModal(null)}>Cancel</Button>
              <Button loading={payMutation.isPending} onClick={() => payMutation.mutate(payModal._id)}>
                Pay ${payModal.amount.toFixed(2)}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Fines;
