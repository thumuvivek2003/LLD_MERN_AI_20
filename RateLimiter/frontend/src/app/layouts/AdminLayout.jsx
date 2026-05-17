import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../../modules/shared/components/Sidebar.jsx';
import { Header } from '../../modules/shared/components/Header.jsx';
import { ADMIN_MENU } from '../../modules/shared/constants/sidebarMenus.js';

function titleFromPath(pathname) {
  if (pathname.startsWith('/admin/strategies')) return 'Strategies';
  if (pathname.startsWith('/admin/config')) return 'Configuration';
  if (pathname.startsWith('/admin/clients/')) return 'Client Details';
  if (pathname.startsWith('/admin/clients')) return 'Users';
  return 'Dashboard';
}

export function AdminLayout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen">
      <Sidebar items={ADMIN_MENU} />
      <div className="flex-1 flex flex-col bg-slate-50">
        <Header title={titleFromPath(location.pathname)} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
