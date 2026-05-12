import { NavLink } from 'react-router-dom';

export const Sidebar = ({ items = [], title }) => {
  return (
    <aside className="w-60 shrink-0 bg-white border-r border-gray-100 min-h-[calc(100vh-4rem)] p-4">
      {title && <div className="text-xs uppercase tracking-wider text-gray-500 px-3 mb-2">{title}</div>}
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive ? 'bg-brand-light text-brand-dark' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
