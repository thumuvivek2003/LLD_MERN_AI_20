import { Link } from 'react-router-dom';
import RegisterForm from './components/RegisterForm.jsx';
import { useLogin } from './useLogin.js';

export default function RegisterPage() {
  const { loading, error, handleRegister } = useLogin();

  return (
    <div style={{ background: '#1a1a2e', borderRadius: 16, padding: 40, width: '100%', maxWidth: 420, border: '1px solid #2a2a3e' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#e50914', letterSpacing: 3, marginBottom: 8 }}>CINEBOOK</h1>
        <p style={{ color: '#a0a0b0', fontSize: 14 }}>Create your account</p>
      </div>
      <RegisterForm onSubmit={handleRegister} loading={loading} error={error} />
      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#a0a0b0' }}>
        Have an account?{' '}
        <Link to="/login" style={{ color: '#e50914' }}>Sign In</Link>
      </p>
    </div>
  );
}
