import { Link } from 'react-router-dom';
import LoginForm from './components/LoginForm.jsx';
import { useLogin } from './useLogin.js';

export default function LoginPage() {
  const { loading, error, handleLogin } = useLogin();

  return (
    <div style={{ background: '#1a1a2e', borderRadius: 16, padding: 40, width: '100%', maxWidth: 420, border: '1px solid #2a2a3e' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#e50914', letterSpacing: 3, marginBottom: 8 }}>CINEBOOK</h1>
        <p style={{ color: '#a0a0b0', fontSize: 14 }}>Sign in to book your tickets</p>
      </div>
      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#a0a0b0' }}>
        No account?{' '}
        <Link to="/register" style={{ color: '#e50914' }}>Register</Link>
      </p>
    </div>
  );
}
