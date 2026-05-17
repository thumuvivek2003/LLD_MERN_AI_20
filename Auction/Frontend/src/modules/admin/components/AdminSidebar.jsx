import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusSquare,
  ListOrdered,
  Users,
  CalendarDays,
  BarChart3,
  Gavel,
  Package,
  LogOut,
} from 'lucide-react';
import { ROUTES } from '../../shared/constants/routes.constant.js';
import { useAuth } from '../../auth/hooks/useAuth.js';

const LINKS = [
  { to: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: ROUTES.ADMIN_AUCTIONS, label: 'Auctions', icon: ListOrdered },
  { to: ROUTES.ADMIN_AUCTION_NEW, label: 'Create Auction', icon: PlusSquare },
  { to: ROUTES.ADMIN_ADD_ITEM, label: 'Add Item', icon: Package },
  { to: ROUTES.ADMIN_USERS, label: 'Users', icon: Users },
  { to: ROUTES.ADMIN_SCHEDULE, label: 'Schedule', icon: CalendarDays },
  { to: ROUTES.ADMIN_REPORTS, label: 'Reports', icon: BarChart3 },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  return (
    <aside className="hidden md:flex md:w-60 lg:w-64 flex-col bg-sidebar text-slate-200">
      <div className="px-5 py-5 border-b border-white/10 flex items-center gap-2">
        <div className="rounded-md bg-brand-600 p-2 text-white">
          <Gavel size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Auction Admin</p>
          <p className="text-[11px] text-slate-400">Control panel</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 px-4 py-4">
        <p className="text-xs text-slate-400">Signed in as</p>
        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
        <button
          onClick={logout}
          className="mt-3 inline-flex items-center gap-2 text-xs text-slate-300 hover:text-white"
        >
          <LogOut size={14} /> Log out
        </button>
      </div>
    </aside>
  );
}
