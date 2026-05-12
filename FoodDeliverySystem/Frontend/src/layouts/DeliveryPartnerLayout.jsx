import { Outlet } from 'react-router-dom';
import { Navbar } from '../shared/components/navigation/Navbar.jsx';
import { Sidebar } from '../shared/components/navigation/Sidebar.jsx';

const items = [
  { to: '/delivery', label: 'Dashboard', icon: '📊', end: true },
  { to: '/delivery/available', label: 'Available', icon: '🆕' },
  { to: '/delivery/ongoing', label: 'Ongoing', icon: '🛵' },
  { to: '/delivery/history', label: 'History', icon: '📚' },
  { to: '/delivery/earnings', label: 'Earnings', icon: '💰' },
  { to: '/delivery/profile', label: 'Profile', icon: '👤' },
];

export const DeliveryPartnerLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="flex">
      <Sidebar items={items} title="Delivery" />
      <main className="flex-1 p-6 max-w-6xl">
        <Outlet />
      </main>
    </div>
  </div>
);
