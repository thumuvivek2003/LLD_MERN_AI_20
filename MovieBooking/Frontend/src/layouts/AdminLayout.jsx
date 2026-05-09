import { Outlet } from 'react-router-dom';
import Sidebar from '../shared/components/Sidebar.jsx';

export default function AdminLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
