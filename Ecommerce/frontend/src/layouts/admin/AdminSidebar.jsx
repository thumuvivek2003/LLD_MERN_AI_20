import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/hooks/useAuth.js';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/coupons', label: 'Coupons', icon: '🎟️' },
  { to: '/admin/orders', label: 'Orders', icon: '📦' },
];

export default function AdminSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white min-h-screen p-5 sticky top-0">
      <div className="flex items-center gap-2 mb-8">
        <span className="h-10 w-10 rounded-xl bg-brand flex items-center justify-center font-bold">S</span>
        <div>
          <p className="font-bold leading-tight">ShopKart</p>
          <p className="text-xs text-slate-400">Admin Panel</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive ? 'bg-brand text-white' : 'text-slate-300 hover:bg-slate-800'
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-6 pt-6 border-t border-slate-800">
        <p className="text-xs text-slate-400">Signed in as</p>
        <p className="text-sm font-semibold truncate">{user?.email}</p>
        <button
          onClick={handleLogout}
          className="mt-3 text-xs font-semibold text-red-300 hover:text-red-200"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
