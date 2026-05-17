import { Outlet } from 'react-router-dom';
import { UserSidebar } from './UserSidebar.jsx';

export function UserLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-wa-light">
      <UserSidebar />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
