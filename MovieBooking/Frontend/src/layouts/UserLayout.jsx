import { Outlet } from 'react-router-dom';
import Navbar from '../shared/components/Navbar.jsx';

export default function UserLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '0 16px' }}>
        <Outlet />
      </main>
    </div>
  );
}
