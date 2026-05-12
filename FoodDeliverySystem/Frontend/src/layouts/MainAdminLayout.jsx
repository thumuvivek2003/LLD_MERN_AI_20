import { Outlet } from 'react-router-dom';
import { Navbar } from '../shared/components/navigation/Navbar.jsx';
import { Sidebar } from '../shared/components/navigation/Sidebar.jsx';

const items = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/restaurants', label: 'Restaurants', icon: '🏪' },
];

export const MainAdminLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="flex">
      <Sidebar items={items} title="System Admin" />
      <main className="flex-1 p-6 max-w-6xl">
        <Outlet />
      </main>
    </div>
  </div>
);
