// pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { getAllTransactions } from '../../services/transaction.service';
import { listBooks } from '../../services/book.service';
import { getUsers } from '../../services/user.service';
import Loader from '../../components/Loader';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalBorrowed: 0,
    totalReturned: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [books, users, transactions] = await Promise.all([
        listBooks(),
        getUsers(),
        getAllTransactions()
      ]);

      setStats({
        totalBooks: books.length,
        totalUsers: users.length,
        totalBorrowed: transactions.filter(t => t.status === 'borrowed').length,
        totalReturned: transactions.filter(t => t.status === 'returned').length
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Books</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalBooks}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalUsers}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-semibold mb-2">Currently Borrowed</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.totalBorrowed}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Returned</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalReturned}</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <a href="/admin/add-book" className="bg-blue-600 text-white text-center py-3 rounded-md hover:bg-blue-700">
            Add New Book
          </a>
          <a href="/admin/manage-users" className="bg-green-600 text-white text-center py-3 rounded-md hover:bg-green-700">
            Manage Users
          </a>
          <a href="/admin/reports" className="bg-purple-600 text-white text-center py-3 rounded-md hover:bg-purple-700">
            View Reports
          </a>
        </div>
      </div>
    </div>
  );
}