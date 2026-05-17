import { NavLink } from 'react-router-dom';

const ICONS = {
  grid: (
    <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
  ),
  layers: (
    <>
      <path d="M12 2 2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </>
  ),
  sliders: (
    <>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <circle cx="4" cy="12" r="2" />
      <circle cx="12" cy="10" r="2" />
      <circle cx="20" cy="14" r="2" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  terminal: (
    <>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </>
  ),
  activity: (
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  ),
};

function Icon({ name }) {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name] || ICONS.grid}
    </svg>
  );
}

export function Sidebar({ items = [], brand = 'Rate Limiter' }) {
  return (
    <aside className="bg-sidebar-gradient text-white w-60 min-h-screen flex flex-col">
      <div className="px-5 py-5 border-b border-white/10 flex items-center gap-2">
        <span className="h-7 w-7 rounded-lg bg-white/15 grid place-items-center text-sm font-bold">
          RL
        </span>
        <span className="font-semibold tracking-wide">{brand}</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.key}
            to={item.to}
            end={item.to === '/admin' || item.to === '/client'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/80 hover:bg-white/10'
              }`
            }
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 text-[11px] text-white/60">v0.1 - learning build</div>
    </aside>
  );
}

export default Sidebar;
