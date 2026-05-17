import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../shared/constants/routes.constant.js';
import { useAuth } from '../../modules/auth/hooks/useAuth.js';

const links = [
  { to: ROUTES.ADMIN, label: 'Dashboard', icon: '\u{1F4CA}' },
  { to: ROUTES.ADMIN_USERS, label: 'Users', icon: '\u{1F465}' },
  { to: ROUTES.ADMIN_GROUPS, label: 'Groups', icon: '\u{1F46A}' },
  { to: ROUTES.ADMIN_SETTINGS, label: 'Settings', icon: '\u{2699}' },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <aside className="flex h-full w-56 flex-col justify-between border-r border-wa-border bg-wa-dark px-3 py-4 text-white">
      <div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.CHATS)}
          className="mb-6 flex items-center gap-2 rounded px-2 py-2 text-left hover:bg-white/10"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-wa-primary text-sm">
            {'\u{1F6E1}'}
          </div>
          <div>
            <div className="text-sm font-semibold">Admin</div>
            <div className="text-[10px] text-white/60">Back to chat</div>
          </div>
        </button>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === ROUTES.ADMIN}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded px-3 py-2 text-sm transition ${
                  isActive ? 'bg-white/15' : 'hover:bg-white/10'
                }`
              }
            >
              <span>{l.icon}</span>
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <button
        type="button"
        onClick={signOut}
        className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-white/10"
      >
        <span>{'\u{1F6AA}'}</span>
        <span>Logout</span>
      </button>
    </aside>
  );
}
