import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationApi } from '../../api/reservationApi';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Reservations = () => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [cancelModal, setCancelModal] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['reservations', page, isAdmin],
    queryFn: () => {
      const fn = isAdmin
        ? reservationApi.getAllReservations({ page, limit: 15 })
        : reservationApi.getUserReservations({ page, limit: 15 });
      return fn.then((r) => r.data.data);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => reservationApi.cancelReservation(id),
    onSuccess: () => {
      toast.success('Reservation cancelled.');
      queryClient.invalidateQueries(['reservations']);
      setCancelModal(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Cancel failed.'),
  });

  const reservations = data?.reservations || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
        <p className="text-gray-500 text-sm">{isAdmin ? 'All library reservations' : 'Your book reservations'}</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[...(isAdmin ? ['Member'] : []), 'Book', 'Reserved On', 'Expires', 'Status', 'Action'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reservations.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No reservations found.</td></tr>
              )}
              {reservations.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 transition">
                  {isAdmin && (
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{r.userId?.name}</p>
                      <p className="text-gray-500 text-xs">{r.userId?.email}</p>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 line-clamp-1">{r.bookId?.title}</p>
                    <p className="text-gray-500 text-xs">{r.bookId?.author}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{format(new Date(r.reservationDate), 'MMM d, yyyy')}</td>
                  <td className="px-6 py-4 text-gray-600">{format(new Date(r.expiryDate), 'MMM d, yyyy')}</td>
                  <td className="px-6 py-4"><Badge label={r.status} /></td>
                  <td className="px-6 py-4">
                    {r.status === 'PENDING' && (
                      <Button size="sm" variant="danger" onClick={() => setCancelModal(r)}>Cancel</Button>
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

      <Modal isOpen={!!cancelModal} onClose={() => setCancelModal(null)} title="Cancel Reservation">
        {cancelModal && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">Cancel reservation for <strong>{cancelModal.bookId?.title}</strong>?</p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setCancelModal(null)}>Keep</Button>
              <Button variant="danger" loading={cancelMutation.isPending}
                onClick={() => cancelMutation.mutate(cancelModal._id)}>
                Cancel Reservation
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Reservations;
