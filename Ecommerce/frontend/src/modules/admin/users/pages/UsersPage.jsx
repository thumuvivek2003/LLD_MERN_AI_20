import { useCallback, useEffect, useMemo, useState } from 'react';
import PageHeader from '../../../../shared/components/PageHeader.jsx';
import Loader from '../../../../shared/components/Loader.jsx';
import EmptyState from '../../../../shared/components/EmptyState.jsx';
import Input from '../../../../shared/components/Input.jsx';
import UserTable from '../components/UserTable.jsx';
import { useDebounce } from '../../../../shared/hooks/useDebounce.js';
import { getUsers, blockUser, unblockUser } from '../services/adminUsers.service.js';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [action, setAction] = useState(false);
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 250);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUsers();
      setUsers(data.users || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function handleBlock(id) {
    setAction(true);
    try {
      await blockUser(id);
      await fetchAll();
    } finally {
      setAction(false);
    }
  }

  async function handleUnblock(id) {
    setAction(true);
    try {
      await unblockUser(id);
      await fetchAll();
    } finally {
      setAction(false);
    }
  }

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q),
    );
  }, [users, debounced]);

  if (loading) return <Loader full />;

  return (
    <div>
      <PageHeader title="User Management" subtitle={`${users.length} registered user(s)`} />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="mb-4 max-w-sm">
        <Input
          placeholder="Search by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {!users.length ? (
        <EmptyState title="No users yet" icon="👥" />
      ) : !filtered.length ? (
        <EmptyState
          title="No matching users"
          message={`No users match "${debounced}".`}
          icon="🔍"
        />
      ) : (
        <UserTable users={filtered} loading={action} onBlock={handleBlock} onUnblock={handleUnblock} />
      )}
    </div>
  );
}
