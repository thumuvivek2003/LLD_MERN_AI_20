import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useAuthStore } from '../../features/auth/auth.store.js';
import Button from './Button.jsx';

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const clearAuth = useAuthStore(s => s.clearAuth);
  const navigate = useNavigate();

  const handleLogout = () => { clearAuth(); navigate('/login'); };

  return (
    <nav style={{ background: '#1a1a2e', borderBottom: '1px solid #2a2a3e', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Link to="/" style={{ fontWeight: 800, fontSize: 22, color: '#e50914', letterSpacing: 2 }}>CINEBOOK</Link>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <Link to="/my-bookings" style={{ color: '#a0a0b0', fontSize: 14 }}>My Bookings</Link>
            <span style={{ color: '#a0a0b0', fontSize: 14 }}>Hi, {user?.name}</span>
            <Button variant="ghost" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <Button onClick={() => navigate('/login')}>Login</Button>
        )}
      </div>
    </nav>
  );
}
