import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import LoginForm from '../components/LoginForm.jsx';
import ErrorMessage from '../../../shared/components/feedback/ErrorMessage.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../../../shared/constants/routes.js';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate(ROUTES.BOOKS);
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign In">
      <ErrorMessage message={error} />
      <LoginForm onSubmit={handleSubmit} loading={loading} />
      <p>No account? <Link to={ROUTES.REGISTER}>Register</Link></p>
    </AuthLayout>
  );
}
