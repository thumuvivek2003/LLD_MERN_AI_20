// pages/admin/ManageUsers.jsx
import { useState, useEffect } from 'react';
import { getUsers, updateUser, deleteUser } from '../../services/user.service';
import UserCard from '../../components/UserCard';
import Loader from '../../components/Loader';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (userId, updates) => {
    try {
      await updateUser(userId, updates);
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await deleteUser(userId);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const filteredUsers = users.filter(u => {
    if (filter === 'all') return true;
    return u.role === filter;
  });

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('member')}
          className={`px-4 py-2 rounded ${filter === 'member' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Members
        </button>
        <button
          onClick={() => setFilter('librarian')}
          className={`px-4 py-2 rounded ${filter === 'librarian' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Librarians
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map(user => (
          <UserCard 
            key={user._id} 
            user={user} 
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}