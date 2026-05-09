import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/auth.store.js';

const links = [
  { to: '/admin', label: '📊 Dashboard', exact: true },
  { to: '/admin/movies', label: '🎬 Movies' },
  { to: '/admin/theaters', label: '🏛️ Theaters' },
  { to: '/admin/shows', label: '🎭 Shows' },
];

export default function Sidebar() {
  const clearAuth = useAuthStore(s => s.clearAuth);
  const navigate = useNavigate();

  return (
    <aside style={{ width: 220, background: '#1a1a2e', borderRight: '1px solid #2a2a3e', display: 'flex', flexDirection: 'column', padding: '24px 0' }}>
      <div style={{ padding: '0 20px 24px', fontWeight: 800, fontSize: 20, color: '#e50914', letterSpacing: 2 }}>CINEBOOK</div>
      <nav style={{ flex: 1 }}>
        {links.map(({ to, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            style={({ isActive }) => ({
              display: 'block', padding: '12px 20px', fontSize: 14, fontWeight: 500,
              color: isActive ? '#e50914' : '#a0a0b0',
              background: isActive ? '#e5091415' : 'transparent',
              borderLeft: isActive ? '3px solid #e50914' : '3px solid transparent',
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <button onClick={() => { clearAuth(); navigate('/login'); }} style={{ margin: '0 20px', padding: '10px', background: 'transparent', border: '1px solid #2a2a3e', borderRadius: 8, color: '#a0a0b0', cursor: 'pointer', fontSize: 14 }}>
        Logout
      </button>
    </aside>
  );
}
