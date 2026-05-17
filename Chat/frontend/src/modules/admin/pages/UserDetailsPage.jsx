import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as adminService from '../services/admin.service.js';
import { useAdmin } from '../hooks/useAdmin.js';
import { Avatar } from '../../../shared/components/Avatar.jsx';
import { Button } from '../../../shared/components/Button.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import { formatDate } from '../../../shared/utils/format-date.util.js';
import { ROUTES } from '../../../shared/constants/routes.constant.js';

export function UserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { block, unblock } = useAdmin();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    adminService
      .fetchUserById(id)
      .then((data) => {
        if (mounted) setUser(data);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  async function handleToggle() {
    if (!user) return;
    setBusy(true);
    try {
      const updated = user.isBlocked ? await unblock(user.id) : await block(user.id);
      if (updated) setUser((u) => ({ ...u, ...updated }));
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <Loader />;
  if (!user) return <div className="p-6 text-sm text-wa-muted">User not found.</div>;

  return (
    <div className="p-6">
      <button
        type="button"
        onClick={() => navigate(ROUTES.ADMIN_USERS)}
        className="mb-4 text-sm text-wa-muted hover:text-wa-dark"
      >
        {'<'} Back to users
      </button>
      <div className="flex items-center gap-4 rounded-lg border border-wa-border bg-white p-6 shadow-sm">
        <Avatar name={user.name} size={72} online={user.isOnline} />
        <div className="flex-1">
          <div className="text-lg font-semibold text-wa-dark">{user.name}</div>
          <div className="text-sm text-wa-muted">+91 {user.mobile}</div>
          <div className="mt-1 flex gap-3 text-xs text-wa-muted">
            <span>Role: {user.role}</span>
            <span>Joined: {formatDate(user.createdAt)}</span>
            <span>
              {user.isOnline
                ? 'Online'
                : `Last seen ${formatDate(user.lastSeen)}`}
            </span>
          </div>
        </div>
        <Button
          variant={user.isBlocked ? 'primary' : 'danger'}
          onClick={handleToggle}
          disabled={busy}
        >
          {user.isBlocked ? 'Unblock' : 'Block'}
        </Button>
      </div>
    </div>
  );
}
