import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <Outlet />
    </div>
  );
}
