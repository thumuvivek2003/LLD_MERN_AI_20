import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getBook } from '../services/bookService.js';
import { requestBorrow } from '../../borrow/services/borrowService.js';
import Loader from '../../../shared/components/ui/Loader.jsx';
import Button from '../../../shared/components/ui/Button.jsx';
import { formatCopies } from '../utils/bookUtils.js';

export default function BookDetailsPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBook(id)
      .then(({ data }) => setBook(data.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBorrow = async () => {
    await requestBorrow(id);
    alert('Borrow request submitted!');
  };

  if (loading) return <Loader />;
  return (
    <div className="page-container">
      <h1 className="page-title">{book?.title}</h1>
      <p>Author: {book?.author}</p>
      <p>ISBN: {book?.isbn}</p>
      <p>{book && formatCopies(book)}</p>
      <Button onClick={handleBorrow} disabled={!book?.availableCopies}>Request Borrow</Button>
    </div>
  );
}
