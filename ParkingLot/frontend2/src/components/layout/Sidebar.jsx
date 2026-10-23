import { NavLink } from 'react-router-dom';
import { Routes } from '../../constants/routes.js';
import { useRole } from '../../hooks/useRole.js';

const ADMIN_NAV = [
  { to: Routes.ADMIN_DASHBOARD, label: 'Dashboard', icon: '▦' },
  { to: Routes.ADMIN_LOTS, label: 'Parking Lots', icon: '▤' },
  { to: Routes.ADMIN_FLOORS, label: 'Floors', icon: '▥' },
  { to: Routes.ADMIN_SLOTS, label: 'Slots', icon: '▣' },
  { to: Routes.ADMIN_USERS, label: 'Users & Roles', icon: '☺' },
  { to: Routes.ADMIN_PRICING, label: 'Pricing', icon: '₹' },
  { to: Routes.ADMIN_PAYMENTS, label: 'Payments', icon: '◈' },
];

const ATTENDANT_NAV = [
  { to: Routes.ENTRY_NEW, label: 'New Entry', icon: '→' },
  { to: Routes.EXIT_SEARCH, label: 'Exit Vehicle', icon: '←' },
];

export function Sidebar() {
  const { isAdmin } = useRole();
  const items = isAdmin ? [...ADMIN_NAV, ...ATTENDANT_NAV] : ATTENDANT_NAV;

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col bg-ink-900 text-ink-100 lg:flex">
      <div className="flex items-center gap-3 px-6 pt-7 pb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 font-bold text-white">
          P
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Parking Lot</p>
          <p className="text-xs text-ink-400">Management System</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6 scrollbar-thin">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition',
                isActive
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'text-ink-300 hover:bg-ink-800 hover:text-white',
              ].join(' ')
            }
          >
            <span className="w-5 text-center text-base leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
