import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/hooks/useAuth.js';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/coupons', label: 'Coupons', icon: '🎟️' },
  { to: '/admin/coupons/new', label: 'New Coupon', icon: '➕' },
  { to: '/admin/orders', label: 'Orders', icon: '📦' },
];

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const linkCls = ({ isActive }) =>
    `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${
      isActive
        ? 'bg-brand text-white shadow-sm'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="lg:hidden flex items-center gap-2 font-bold">
          <span className="h-8 w-8 rounded-xl bg-brand text-white flex items-center justify-center text-sm">S</span>
          <span>ShopKart Admin</span>
        </div>
        <div className="hidden lg:block">
          <p className="text-xs text-slate-500">Welcome back,</p>
          <p className="font-semibold text-slate-900">{user?.name || 'Admin'}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-brand text-white flex items-center justify-center font-bold">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <button
            onClick={handleLogout}
            className="lg:hidden text-xs font-semibold text-slate-500 hover:text-red-500"
          >
            Logout
          </button>
        </div>
      </div>
      <nav className="px-4 sm:px-6 pb-3 flex items-center gap-2 overflow-x-auto">
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkCls}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
