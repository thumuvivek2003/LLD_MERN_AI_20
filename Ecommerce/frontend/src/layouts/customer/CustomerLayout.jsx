import { Outlet } from 'react-router-dom';
import CustomerNavbar from './CustomerNavbar.jsx';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
