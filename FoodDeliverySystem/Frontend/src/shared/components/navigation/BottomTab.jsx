import { NavLink } from 'react-router-dom';

export const BottomTab = ({ items = [] }) => (
  <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 z-30">
    <div className="grid grid-cols-4">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-2.5 text-xs ${
              isActive ? 'text-brand' : 'text-gray-500'
            }`
          }
        >
          <span className="text-lg">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </div>
  </nav>
);
