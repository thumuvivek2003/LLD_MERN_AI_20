import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/hooks/useAuth.js';
import { ROUTES } from '../../shared/constants/routes.constant.js';
import { Avatar } from '../../shared/components/Avatar.jsx';

const links = [
  { to: ROUTES.CHATS, label: 'Chats', icon: '\u{1F4AC}' },
  { to: ROUTES.CONTACTS, label: 'Contacts', icon: '\u{1F465}' },
  { to: ROUTES.NEW_CHAT, label: 'New chat', icon: '\u{2795}' },
  { to: ROUTES.NEW_GROUP, label: 'New group', icon: '\u{1F46A}' },
  { to: ROUTES.PROFILE, label: 'Profile', icon: '\u{1F464}' },
  { to: ROUTES.SETTINGS, label: 'Settings', icon: '\u{2699}' },
];

export function UserSidebar() {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="flex h-full w-16 flex-col items-center justify-between border-r border-wa-border bg-wa-dark py-3 text-white md:w-56 md:items-stretch md:px-2">
      <div className="flex flex-col items-stretch gap-1">
        <button
          type="button"
          onClick={() => navigate(ROUTES.PROFILE)}
          className="mb-3 mt-1 flex items-center gap-2 rounded px-2 py-2 text-left hover:bg-white/10"
        >
          <Avatar name={user?.name} size={36} />
          <div className="hidden flex-1 md:block">
            <div className="truncate text-sm font-semibold">{user?.name}</div>
            <div className="truncate text-[10px] text-white/60">
              +91 {user?.mobile}
            </div>
          </div>
        </button>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === ROUTES.CHATS}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded px-3 py-2 text-sm transition ${
                isActive ? 'bg-white/15' : 'hover:bg-white/10'
              }`
            }
          >
            <span className="text-base">{l.icon}</span>
            <span className="hidden md:inline">{l.label}</span>
          </NavLink>
        ))}
        {isAdmin ? (
          <NavLink
            to={ROUTES.ADMIN}
            className={({ isActive }) =>
              `mt-2 flex items-center gap-3 rounded border-t border-white/10 px-3 py-2 text-sm transition ${
                isActive ? 'bg-white/15' : 'hover:bg-white/10'
              }`
            }
          >
            <span className="text-base">{'\u{1F6E1}'}</span>
            <span className="hidden md:inline">Admin</span>
          </NavLink>
        ) : null}
      </div>
      <button
        type="button"
        onClick={signOut}
        className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-white/10"
        title="Logout"
      >
        <span>{'\u{1F6AA}'}</span>
        <span className="hidden md:inline">Logout</span>
      </button>
    </aside>
  );
}
