import PageHeader from '../../../shared/components/PageHeader.jsx';
import Button from '../../../shared/components/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div>
      <PageHeader title="Profile" subtitle="Your account details" />
      <div className="card max-w-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-brand text-white flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-lg font-semibold">{user?.name}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-3">
          <Row label="Role" value={user?.role || '-'} />
          <Row label="Status" value={user?.blocked ? 'Blocked' : 'Active'} />
          <Row label="User ID" value={user?._id || '-'} />
        </div>
        <div className="mt-6">
          <Button variant="danger" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-800">{value}</span>
    </div>
  );
}
