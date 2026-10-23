import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Routes } from '../../constants/routes.js';
import { RoleLabels } from '../../constants/roles.js';
import { generateColor } from '../../utils/generateColor.js';

export function Header() {
  const navigate = useNavigate();
  const { user, clearSession } = useAuth();

  const initials = (user?.email || '?')
    .split('@')[0]
    .slice(0, 2)
    .toUpperCase();

  const onLogout = () => {
    clearSession();
    navigate(Routes.LOGIN, { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-ink-100 bg-white px-6">
      <div>
        <h1 className="text-base font-semibold text-ink-900">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
        </h1>
        <p className="text-xs text-ink-500">
          {user?.role ? RoleLabels[user.role] || user.role : 'Signed in'}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: generateColor(user?.email) }}
        >
          {initials}
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
