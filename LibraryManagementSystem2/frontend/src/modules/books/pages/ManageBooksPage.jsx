import { useState } from 'react';
import BookTable from '../components/BookTable.jsx';
import AddBookModal from '../components/AddBookModal.jsx';
import EditBookModal from '../components/EditBookModal.jsx';
import Button from '../../../shared/components/ui/Button.jsx';
import Loader from '../../../shared/components/ui/Loader.jsx';
import { useBooks } from '../hooks/useBooks.js';
import { useModal } from '../../../shared/hooks/useModal.js';
import { deleteBook } from '../services/bookService.js';

export default function ManageBooksPage() {
  const { books, loading, refetch } = useBooks();
  const addModal = useModal();
  const editModal = useModal();
  const [selected, setSelected] = useState(null);

  const handleEdit = (book) => { setSelected(book); editModal.open(); };
  const handleDelete = async (id) => { await deleteBook(id); refetch(); };

  if (loading) return <Loader />;
  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Manage Books</h1>
        <Button onClick={addModal.open}>+ Add Book</Button>
      </div>
      <BookTable books={books} onEdit={handleEdit} onDelete={handleDelete} />
      <AddBookModal isOpen={addModal.isOpen} onClose={addModal.close} onAdded={refetch} />
      {selected && (
        <EditBookModal isOpen={editModal.isOpen} onClose={editModal.close} book={selected} onUpdated={refetch} />
      )}
    </div>
  );
}
