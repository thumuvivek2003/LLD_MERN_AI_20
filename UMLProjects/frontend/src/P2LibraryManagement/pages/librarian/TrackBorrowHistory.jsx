// pages/librarian/TrackBorrowHistory.jsx
import { useState, useEffect } from 'react';
import { getAllTransactions } from '../../services/transaction.service';
import TransactionCard from '../../components/TransactionCard';
import Loader from '../../components/Loader';

export default function TrackBorrowHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Borrow History</h1>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('borrowed')}
          className={`px-4 py-2 rounded ${filter === 'borrowed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Borrowed
        </button>
        <button
          onClick={() => setFilter('returned')}
          className={`px-4 py-2 rounded ${filter === 'returned' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Returned
        </button>
      </div>

      <div className="grid gap-4">
        {filteredTransactions.map(transaction => (
          <TransactionCard key={transaction._id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}