import { NavLink } from 'react-router-dom';
import { Gavel, Wallet, ListChecks, Trophy, User, LogOut, LayoutDashboard } from 'lucide-react';
import { ROUTES } from '../../shared/constants/routes.constant.js';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { formatCurrency } from '../../shared/utils/currency.util.js';

const LINKS = [
  { to: ROUTES.MEMBER_DASHBOARD, label: 'Home', icon: LayoutDashboard, end: true },
  { to: ROUTES.MEMBER_AUCTIONS, label: 'Auctions', icon: Gavel },
  { to: ROUTES.MEMBER_WALLET, label: 'Wallet', icon: Wallet },
  { to: ROUTES.MEMBER_BIDS, label: 'My Bids', icon: ListChecks },
  { to: ROUTES.MEMBER_WINS, label: 'My Wins', icon: Trophy },
  { to: ROUTES.MEMBER_PROFILE, label: 'Profile', icon: User },
];

export default function MemberNavbar() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-brand-600 p-1.5 text-white">
            <Gavel size={16} />
          </div>
          <span className="font-semibold text-slate-800">Auction</span>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wide text-slate-400">Wallet</span>
            <span className="text-sm font-semibold text-slate-800">
              {formatCurrency(user?.walletBalance ?? 0)}
            </span>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>
    </header>
  );
}
