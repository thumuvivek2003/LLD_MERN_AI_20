// pages/admin/DeleteBook.jsx
import { useState } from 'react';
import { getBook, deleteBook } from '../../services/book.service';

export default function DeleteBook() {
  const [bookId, setBookId] = useState('');
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const data = await getBook(bookId);
      setBook(data);
    } catch (error) {
      setMessage('Book not found');
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      await deleteBook(bookId);
      setMessage('Book deleted successfully');
      setBook(null);
      setBookId('');
    } catch (error) {
      setMessage('Failed to delete book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Delete Book</h1>

      <form onSubmit={handleSearch} className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            placeholder="Enter Book ID"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            Search
          </button>
        </div>
      </form>

      {book && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Book Details</h2>
          <div className="space-y-2 mb-6">
            <p><span className="font-semibold">Title:</span> {book.title}</p>
            <p><span className="font-semibold">Author:</span> {book.author}</p>
            <p><span className="font-semibold">ISBN:</span> {book.isbn}</p>
            <p><span className="font-semibold">Category:</span> {book.category}</p>
            <p><span className="font-semibold">Available Copies:</span> {book.availableCopies}</p>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded ${message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}

          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400"
          >
            {loading ? 'Deleting...' : 'Delete Book'}
          </button>
        </div>
      )}
    </div>
  );
}