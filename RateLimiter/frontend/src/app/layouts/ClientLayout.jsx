import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../../modules/shared/components/Sidebar.jsx';
import { Header } from '../../modules/shared/components/Header.jsx';
import { CLIENT_MENU } from '../../modules/shared/constants/sidebarMenus.js';

function titleFromPath(pathname) {
  if (pathname.startsWith('/client/console')) return 'API Console';
  if (pathname.startsWith('/client/history')) return 'Usage History';
  return 'My Dashboard';
}

export function ClientLayout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen">
      <Sidebar items={CLIENT_MENU} />
      <div className="flex-1 flex flex-col bg-slate-50">
        <Header title={titleFromPath(location.pathname)} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ClientLayout;
