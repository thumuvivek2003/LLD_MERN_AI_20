import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar.jsx';
import { AdminHeader } from './AdminHeader.jsx';

export function AdminLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-wa-light">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
