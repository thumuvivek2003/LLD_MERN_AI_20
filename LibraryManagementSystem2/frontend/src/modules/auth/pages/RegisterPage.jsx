import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import Input from '../../../shared/components/ui/Input.jsx';
import Button from '../../../shared/components/ui/Button.jsx';
import ErrorMessage from '../../../shared/components/feedback/ErrorMessage.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../../../shared/constants/routes.js';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate(ROUTES.LOGIN);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Register">
      <ErrorMessage message={error} />
      <form onSubmit={handleSubmit}>
        <Input label="Name" name="name" value={form.name} onChange={set} />
        <Input label="Email" name="email" type="email" value={form.email} onChange={set} />
        <Input label="Password" name="password" type="password" value={form.password} onChange={set} />
        <Button type="submit" disabled={loading}>Register</Button>
      </form>
      <p>Have an account? <Link to={ROUTES.LOGIN}>Login</Link></p>
    </AuthLayout>
  );
}
