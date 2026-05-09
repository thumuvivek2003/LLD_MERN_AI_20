import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { bookApi } from '../../api/bookApi';
import { borrowApi } from '../../api/borrowApi';
import { reservationApi } from '../../api/reservationApi';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const BooksList = () => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [genreFilter, setGenreFilter] = useState('');
  const [confirmModal, setConfirmModal] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['books', page, search, genreFilter],
    queryFn: () => bookApi.getBooks({ page, limit: 12, search: search || undefined, genre: genreFilter || undefined }).then((r) => r.data.data),
    keepPreviousData: true,
  });

  const borrowMutation = useMutation({
    mutationFn: (bookId) => borrowApi.borrowBook(bookId),
    onSuccess: (res) => {
      toast.success('Book borrowed successfully!');
      queryClient.invalidateQueries(['books']);
      setConfirmModal(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to borrow.'),
  });

  const reserveMutation = useMutation({
    mutationFn: (bookId) => reservationApi.createReservation(bookId),
    onSuccess: () => {
      toast.success('Reservation created!');
      queryClient.invalidateQueries(['books']);
      setConfirmModal(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to reserve.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => bookApi.deleteBook(id),
    onSuccess: () => {
      toast.success('Book deleted.');
      queryClient.invalidateQueries(['books']);
      setConfirmModal(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed.'),
  });

  const books = data?.books || [];
  const genres = [...new Set(books.map((b) => b.genre))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Books</h1>
          <p className="text-gray-500 text-sm">Browse and manage library books</p>
        </div>
        {isAdmin && (
          <Link to="/books/add">
            <Button>+ Add Book</Button>
          </Link>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-64">
          <Input
            placeholder="Search by title, author, ISBN..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="input-field w-40"
          value={genreFilter}
          onChange={(e) => { setGenreFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Genres</option>
          {['Technology', 'Fiction', 'Self-Help', 'History', 'Science'].map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {books.map((book) => (
              <div key={book._id} className="card hover:shadow-md transition flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <Badge label={book.status} />
                    <span className="text-xs text-gray-400">{book.genre}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-gray-500 text-xs mb-1">{book.author}</p>
                  <p className="text-gray-400 text-xs">ISBN: {book.isbn}</p>
                  <p className="text-gray-400 text-xs mt-1">{book.availableCopies}/{book.totalCopies} copies available</p>
                </div>

                <div className="mt-4 flex gap-2 flex-wrap">
                  {!isAdmin && book.availableCopies > 0 && (
                    <Button size="sm" onClick={() => setConfirmModal({ type: 'borrow', book })}>
                      Borrow
                    </Button>
                  )}
                  {!isAdmin && book.availableCopies === 0 && (
                    <Button size="sm" variant="secondary" onClick={() => setConfirmModal({ type: 'reserve', book })}>
                      Reserve
                    </Button>
                  )}
                  {isAdmin && (
                    <>
                      <Link to={`/books/edit/${book._id}`}>
                        <Button size="sm" variant="secondary">Edit</Button>
                      </Link>
                      <Button size="sm" variant="danger" onClick={() => setConfirmModal({ type: 'delete', book })}>
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {data?.pages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span className="flex items-center text-sm text-gray-600 px-2">
                Page {data.page} of {data.pages}
              </span>
              <Button variant="secondary" size="sm" disabled={page === data.pages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        title={
          confirmModal?.type === 'borrow' ? 'Confirm Borrow' :
          confirmModal?.type === 'reserve' ? 'Confirm Reservation' : 'Delete Book'
        }
      >
        {confirmModal && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              {confirmModal.type === 'borrow' && <>Borrow <strong>{confirmModal.book.title}</strong>? Due in 14 days.</>}
              {confirmModal.type === 'reserve' && <>Reserve <strong>{confirmModal.book.title}</strong>? Expires in 3 days.</>}
              {confirmModal.type === 'delete' && <>Permanently delete <strong>{confirmModal.book.title}</strong>? This cannot be undone.</>}
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setConfirmModal(null)}>Cancel</Button>
              <Button
                variant={confirmModal.type === 'delete' ? 'danger' : 'primary'}
                loading={borrowMutation.isPending || reserveMutation.isPending || deleteMutation.isPending}
                onClick={() => {
                  if (confirmModal.type === 'borrow') borrowMutation.mutate(confirmModal.book._id);
                  else if (confirmModal.type === 'reserve') reserveMutation.mutate(confirmModal.book._id);
                  else deleteMutation.mutate(confirmModal.book._id);
                }}
              >
                {confirmModal.type === 'delete' ? 'Delete' : 'Confirm'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BooksList;
