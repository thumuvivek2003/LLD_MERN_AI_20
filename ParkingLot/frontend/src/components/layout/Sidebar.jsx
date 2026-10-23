import { NavLink } from 'react-router-dom';
import { Routes as R } from '../../constants/routes.js';
import { Role } from '../../constants/roles.js';
import { useRole } from '../../hooks/useRole.js';

const ITEMS = [
  { to: R.ADMIN.DASHBOARD, label: 'Dashboard', roles: [Role.ADMIN] },
  { to: R.ADMIN.LOTS, label: 'Parking Lots', roles: [Role.ADMIN] },
  { to: R.ADMIN.FLOORS, label: 'Floors', roles: [Role.ADMIN] },
  { to: R.ADMIN.SLOTS, label: 'Slots', roles: [Role.ADMIN] },
  { to: R.ADMIN.USERS, label: 'Users', roles: [Role.ADMIN] },
  { to: R.ADMIN.PRICING, label: 'Pricing', roles: [Role.ADMIN] },
  { to: R.ADMIN.PAYMENTS, label: 'Payments', roles: [Role.ADMIN] },
  { to: R.ENTRY.NEW, label: 'New Entry', roles: [Role.ADMIN, Role.ATTENDANT] },
  { to: R.EXIT.SEARCH, label: 'Exit', roles: [Role.ADMIN, Role.ATTENDANT] },
];

export const Sidebar = () => {
  const { has } = useRole();
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="px-5 py-5">
        <div className="text-lg font-bold text-brand-700">ParkSmart</div>
        <div className="text-xs text-slate-500">Parking management</div>
      </div>
      <nav className="flex-1 px-3 pb-4">
        {ITEMS.filter((i) => has(...i.roles)).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm font-medium ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
