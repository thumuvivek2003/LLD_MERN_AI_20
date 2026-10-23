// components/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useRole } from '../hooks/useRole';

function Sidebar() {
  const location = useLocation();
  const { role } = useRole();

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/add-book', label: 'Add Book' },
    { path: '/admin/update-book', label: 'Update Book' },
    { path: '/admin/delete-book', label: 'Delete Book' },
    { path: '/admin/manage-users', label: 'Manage Users' },
    { path: '/admin/reports', label: 'Reports' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-2">
          {adminLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-2 rounded transition ${
                isActive(link.path)
                  ? 'bg-blue-600'
                  : 'hover:bg-gray-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;