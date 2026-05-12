import { Outlet } from 'react-router-dom';
import { Navbar } from '../shared/components/navigation/Navbar.jsx';
import { Sidebar } from '../shared/components/navigation/Sidebar.jsx';

const items = [
  { to: '/restaurant', label: 'Dashboard', icon: '📊', end: true },
  { to: '/restaurant/orders', label: 'Incoming Orders', icon: '📥' },
  { to: '/restaurant/menu', label: 'Menu', icon: '🍽️' },
  { to: '/restaurant/profile', label: 'Profile', icon: '🏪' },
];

export const RestaurantAdminLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="flex">
      <Sidebar items={items} title="Restaurant" />
      <main className="flex-1 p-6 max-w-6xl">
        <Outlet />
      </main>
    </div>
  </div>
);
