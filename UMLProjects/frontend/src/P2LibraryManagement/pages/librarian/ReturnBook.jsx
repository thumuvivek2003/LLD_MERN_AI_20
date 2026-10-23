// pages/librarian/ReturnBook.jsx
import { useState } from 'react';
import { returnBook } from '../../services/book.service';

function ReturnBook() {
  const [transactionId, setTransactionId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await returnBook(transactionId);
      setMessage('Book returned successfully');
      setTransactionId('');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Return Book</h1>
      {message && (
        <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4">{message}</div>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Transaction ID</label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Return Book
        </button>
      </form>
    </div>
  );
}

export default ReturnBook;