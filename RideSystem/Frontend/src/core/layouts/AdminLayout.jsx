import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const items = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/riders', label: 'Riders', icon: '🧍' },
  { to: '/admin/drivers', label: 'Drivers', icon: '🚖' },
  { to: '/admin/rides', label: 'Rides', icon: '🛣️' },
  { to: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { to: '/admin/profile', label: 'Profile', icon: '👤' },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden md:flex w-64 bg-indigo-700 text-white flex-col">
        <div className="p-5">
          <div className="text-xl font-bold">Ride Admin</div>
          <p className="text-xs text-indigo-200">Operations console</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {items.map((it) => (
            <NavLink key={it.to} to={it.to} end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${isActive ? 'bg-white/15 font-semibold' : 'hover:bg-white/10'}`}>
              <span>{it.icon}</span>{it.label}
            </NavLink>
          ))}
        </nav>
        <button className="p-4 text-sm text-indigo-200 hover:text-white text-left" onClick={() => { signOut(); navigate('/login'); }}>
          Sign out
        </button>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-100 px-5 py-3 flex items-center justify-between">
          <p className="text-sm text-slate-500">Welcome, <span className="font-semibold text-ink">{user?.name}</span></p>
          <div className="flex md:hidden gap-3">
            {items.slice(0, 5).map((it) => (
              <NavLink key={it.to} to={it.to} end className="text-xl">{it.icon}</NavLink>
            ))}
          </div>
        </header>
        <main className="flex-1 p-5 max-w-7xl w-full mx-auto"><Outlet /></main>
      </div>
    </div>
  );
}
