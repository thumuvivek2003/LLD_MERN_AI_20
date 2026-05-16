import { Outlet } from 'react-router-dom';
import { Sidebar } from '../shared/components/Sidebar.jsx';
import { Topbar } from '../shared/components/Topbar.jsx';

export function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
