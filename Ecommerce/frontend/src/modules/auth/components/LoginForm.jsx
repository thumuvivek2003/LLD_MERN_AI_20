import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Button from '../../../shared/components/Button.jsx';
import Input from '../../../shared/components/Input.jsx';
import { useAuth } from '../hooks/useAuth.js';

export default function LoginForm() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const user = await login(form);
      const target = user.role === 'admin' ? '/admin' : location.state?.from?.pathname || '/';
      navigate(target, { replace: true });
    } catch {
      // error shown inline
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="you@example.com"
      />
      <Input
        label="Password"
        type="password"
        required
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        placeholder="••••••••"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>
      <p className="text-sm text-slate-500 text-center">
        New here?{' '}
        <Link to="/register" className="text-brand font-semibold hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
