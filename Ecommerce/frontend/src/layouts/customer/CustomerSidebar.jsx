import { NavLink } from 'react-router-dom';

const NAV = [
  { to: '/', label: 'Browse Products', icon: '🛍️', end: true },
  { to: '/cart', label: 'My Cart', icon: '🛒' },
  { to: '/orders', label: 'My Orders', icon: '📦' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export default function CustomerSidebar() {
  return (
    <aside className="hidden lg:block w-60 shrink-0">
      <nav className="card sticky top-20 p-3">
        <ul className="space-y-1">
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                    isActive ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
