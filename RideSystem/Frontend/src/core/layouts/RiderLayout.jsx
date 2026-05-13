import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const navItems = [
  { to: '/rider', label: 'Home', icon: '🏠' },
  { to: '/rider/find', label: 'Book', icon: '🚖' },
  { to: '/rider/history', label: 'History', icon: '🧾' },
];

export default function RiderLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-brand text-white grid place-items-center font-bold">R</div>
            <div>
              <p className="text-sm font-semibold leading-tight">Ride System</p>
              <p className="text-[11px] text-slate-500">Hi, {user?.name}</p>
            </div>
          </div>
          <button className="text-sm text-slate-600 hover:text-slate-900" onClick={() => { signOut(); navigate('/login'); }}>
            Sign out
          </button>
        </div>
      </header>
      <main className="flex-1 max-w-3xl w-full mx-auto p-4"><Outlet /></main>
      <nav className="sticky bottom-0 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto grid grid-cols-3">
          {navItems.map((it) => (
            <NavLink key={it.to} to={it.to} end
              className={({ isActive }) => `flex flex-col items-center py-3 text-xs ${isActive ? 'text-brand font-semibold' : 'text-slate-500'}`}>
              <span className="text-lg">{it.icon}</span>
              {it.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
