import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin.js';
import { UserTable } from '../components/UserTable.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import { Input } from '../../../shared/components/Input.jsx';
import { ROUTES } from '../../../shared/constants/routes.constant.js';

export function UsersPage() {
  const navigate = useNavigate();
  const { users, loading, loadUsers, block, unblock } = useAdmin();
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filtered = users.filter((u) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      (u.mobile || '').includes(query.replace(/\D/g, ''))
    );
  });

  return (
    <div className="p-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-wa-dark">Users</h1>
          <p className="text-sm text-wa-muted">
            Manage user access, view online status.
          </p>
        </div>
        <div className="w-72">
          <Input
            placeholder="Search by name or mobile"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      {loading && users.length === 0 ? (
        <Loader />
      ) : (
        <UserTable
          users={filtered}
          onBlock={(u) => block(u.id)}
          onUnblock={(u) => unblock(u.id)}
          onView={(u) => navigate(ROUTES.ADMIN_USER_DETAIL(u.id))}
        />
      )}
    </div>
  );
}
