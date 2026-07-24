import { useState } from 'react';
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useUser } from '../shared/context/UserContext.jsx';
import { useSocketContext } from '../shared/socket/SocketProvider.jsx';
import Avatar from '../shared/components/Avatar.jsx';
import Button from '../shared/components/Button.jsx';
import SearchBar from '../shared/components/SearchBar.jsx';
import {
  InboxIcon,
  SendIcon,
  SearchIcon,
  PencilIcon,
  BellIcon,
  MenuIcon,
} from '../shared/components/Icons.jsx';

const NAV = [
  { to: '/inbox', label: 'Inbox', icon: InboxIcon },
  { to: '/sent', label: 'Sent', icon: SendIcon },
  { to: '/search', label: 'Search', icon: SearchIcon },
];

function Sidebar({ onNavigate }) {
  return (
    <div className="flex h-full w-64 flex-col gap-6 border-r border-slate-200 bg-white px-4 py-6">
      <Link to="/inbox" className="flex items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl brand-gradient text-white shadow-soft">
          <InboxIcon size={20} />
        </span>
        <span className="text-lg font-extrabold tracking-tight">
          <span className="brand-text">Mail</span>box
        </span>
      </Link>

      <Link to="/compose" onClick={onNavigate}>
        <Button leftIcon={PencilIcon} size="lg" className="w-full">
          Compose
        </Button>
      </Link>

      <nav className="flex flex-col gap-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-brand-600' : 'text-slate-400'}>
                  <Icon size={20} />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl bg-gradient-to-br from-brand-50 to-violet-50 p-4">
        <p className="text-xs font-semibold text-brand-700">Gmail MVP</p>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
          Real-time email with threading, search and multi-user support.
        </p>
      </div>
    </div>
  );
}

export default function MailLayout() {
  const { currentUser, switchUser } = useUser();
  const { connected } = useSocketContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNav, setMobileNav] = useState(false);

  const goSearch = (q) => {
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  const switchAccount = () => {
    switchUser(null);
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:block">
        <Sidebar />
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileNav && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMobileNav(false)}
          />
          <div className="absolute left-0 top-0 h-full animate-fade-in">
            <Sidebar onNavigate={() => setMobileNav(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur md:px-6">
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
            onClick={() => setMobileNav(true)}
          >
            <MenuIcon size={20} />
          </button>

          <div className="max-w-xl flex-1">
            <SearchBar
              key={location.key}
              onSubmit={goSearch}
              placeholder="Search mail"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span
              className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
              title={connected ? 'Connected' : 'Reconnecting…'}
            >
              <BellIcon size={20} />
              <span
                className={`absolute right-2 top-2 h-2 w-2 rounded-full ${
                  connected ? 'bg-emerald-400' : 'bg-slate-300'
                }`}
              />
            </span>

            <button
              onClick={switchAccount}
              className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition hover:bg-slate-100"
              title="Switch user"
            >
              <Avatar
                name={currentUser?.name}
                color={currentUser?.avatarColor}
                size="sm"
              />
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold leading-tight text-slate-700">
                  {currentUser?.name}
                </span>
                <span className="block text-[11px] leading-tight text-slate-400">
                  {currentUser?.email}
                </span>
              </span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
