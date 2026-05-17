import { Outlet } from 'react-router-dom';
import AdminSidebar from '../modules/admin/components/AdminSidebar.jsx';

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
