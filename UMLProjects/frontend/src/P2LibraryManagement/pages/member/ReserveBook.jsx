// pages/member/ReserveBook.jsx
import { useState, useEffect } from 'react';
import { getBooks, reserveBook } from '../../services/book.service';
import BookCard from '../../components/BookCard';
import Loader from '../../components/Loader';

function ReserveBook() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data.filter(book => book.available));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (book) => {
    try {
      await reserveBook(book._id);
      setMessage(`Successfully reserved ${book.title}`);
      fetchBooks();
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reserve Book</h1>
      {message && (
        <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4">{message}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard
            key={book._id}
            book={book}
            onAction={handleReserve}
            actionLabel="Reserve"
          />
        ))}
      </div>
    </div>
  );
}

export default ReserveBook;