import { useAuth } from '../../../modules/auth/hooks/useAuth.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="navbar">
      <span>Welcome, {user?.name}</span>
      <button className="btn btn-secondary" onClick={logout}>Logout</button>
    </header>
  );
}
