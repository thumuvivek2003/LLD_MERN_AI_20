import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/hooks/useAuth.js';
import { useCart } from '../../modules/cart/hooks/useCart.js';

const NAV = [
  { to: '/', label: 'Products', icon: '🛍️', end: true },
  { to: '/cart', label: 'Cart', icon: '🛒' },
  { to: '/orders', label: 'My Orders', icon: '📦' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export default function CustomerNavbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const navCls = ({ isActive }) =>
    `text-sm font-medium transition ${isActive ? 'text-brand' : 'text-slate-600 hover:text-brand'}`;

  const mobileNavCls = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
      isActive ? 'bg-brand text-white' : 'text-slate-700 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg" onClick={() => setOpen(false)}>
          <span className="h-9 w-9 rounded-xl bg-brand text-white flex items-center justify-center">S</span>
          <span className="hidden sm:inline">ShopKart</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV.filter((n) => n.to !== '/cart').map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navCls}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative" onClick={() => setOpen(false)}>
            <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-brand-light text-brand-dark font-semibold text-sm">
              🛒 <span className="hidden sm:inline">Cart</span>
            </span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <div className="hidden sm:block text-right">
            <p className="text-xs text-slate-500">Hi,</p>
            <p className="text-sm font-semibold text-slate-800">{user?.name || 'Guest'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="hidden md:inline text-xs font-semibold text-slate-500 hover:text-red-500"
          >
            Logout
          </button>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-xl border border-slate-200 text-slate-700"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={mobileNavCls}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50"
            >
              <span>↩</span>
              <span>Logout</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
