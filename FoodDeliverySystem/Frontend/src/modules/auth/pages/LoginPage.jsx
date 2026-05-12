import { Link, useNavigate } from 'react-router-dom';
import { LoginForm } from '../../../shared/components/forms/LoginForm.jsx';
import { useLogin } from '../hooks/useLogin.js';

export const LoginPage = () => {
  const { submit, loading } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (creds) => {
    try { await submit(creds); navigate('/'); } catch {}
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-brand to-brand-dark p-8">
        <div className="text-white max-w-md">
          <h1 className="text-5xl font-extrabold mb-4">Foodie 🍔</h1>
          <p className="text-lg opacity-90">Hot meals delivered to your door. Track every step from kitchen to doorstep.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
          <p className="text-gray-500 mb-6">Sign in to your account</p>
          <LoginForm onSubmit={handleSubmit} loading={loading} />
          <p className="text-sm text-gray-500 mt-4 text-center">
            New here? <Link to="/register" className="text-brand font-medium">Create account</Link>
          </p>
          <div className="mt-6 text-xs text-gray-400 border-t pt-3">
            <p>Demo logins (pwd: <code>password123</code>):</p>
            <p>admin@food.com · john@food.com · raj@food.com · dev@food.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};
